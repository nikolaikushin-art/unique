#!/usr/bin/env node
/**
 * Upload public media to R2 using Supabase edge function `r2-storage`
 * action `presign-upload` (avoids needing local R2 secret).
 *
 * Auth: SUPABASE login (info@ / admin) via env or defaults for QA.
 * Usage: node scripts/upload-assets-via-presign.mjs
 */
import { existsSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvFile(new URL("../.env.local", import.meta.url).pathname);
loadEnvFile(new URL("../.env.supabase.local", import.meta.url).pathname);

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://flqgrcmevbjavafppqmh.supabase.co";
const ANON =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_5s6Dr0OwMt32ibBQbw6Bxw_7KZAhSqI";
const EMAIL = process.env.UPLOAD_EMAIL || "info@uniquedetailing.ru";
const PASSWORD = process.env.UPLOAD_PASSWORD || "Unique777";
const PUBLIC_URL =
  (process.env.VITE_CDN_URL || "https://pub-d232aa7dc74242bdab9a8077f5ceaefa.r2.dev").replace(
    /\/$/,
    "",
  );

const ROOT = new URL("..", import.meta.url).pathname;
const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function toKey(absPath) {
  const rel = relative(ROOT, absPath).replace(/\\/g, "/");
  if (rel.startsWith("public/portfolio/")) {
    return `assets/gallery/${rel.slice("public/portfolio/".length)}`;
  }
  if (rel.startsWith("public/ppf/")) {
    return `assets/services/${rel.slice("public/ppf/".length)}`;
  }
  if (rel.startsWith("public/media/")) {
    const name = rel.slice("public/media/".length);
    if (name === "logo.png") return "assets/unique-detailing-logo.png";
    if (name === "numberplate-logo.png") return "assets/unique-detailing-numberplate-logo.png";
    if (name === "hero.mp4") return "assets/marketing/hero.mp4";
    return `assets/marketing/${name}`;
  }
  if (rel === "public/og-cover.jpg") return "assets/marketing/og-cover.jpg";
  return null;
}

async function login() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login failed: ${res.status} ${await res.text()}`);
  const j = await res.json();
  return j.access_token;
}

async function alreadyPublic(key) {
  const res = await fetch(`${PUBLIC_URL}/${key}`, { method: "HEAD" });
  return res.ok;
}

async function presign(token, key, contentType) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/r2-storage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: ANON,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "presign-upload",
      key,
      contentType,
      content_type: contentType,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`presign ${key}: ${res.status} ${text}`);
  const j = JSON.parse(text);
  const signedUrl = j.signedUrl || j.url || j.uploadUrl;
  if (!signedUrl) throw new Error(`no signedUrl for ${key}: ${text}`);
  return signedUrl;
}

async function put(signedUrl, body, contentType) {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PUT failed ${res.status}: ${t.slice(0, 200)}`);
  }
}

const force = process.argv.includes("--force");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];

const sources = [
  join(ROOT, "public/portfolio"),
  join(ROOT, "public/ppf"),
  join(ROOT, "public/media"),
  join(ROOT, "public/og-cover.jpg"),
].filter((p) => existsSync(p));

let files = [];
for (const src of sources) {
  const st = statSync(src);
  if (st.isDirectory()) files.push(...walk(src));
  else files.push(src);
}
files = files.filter((f) => toKey(f));
if (only) files = files.filter((f) => relative(ROOT, f).includes(only));

console.log(`Uploading up to ${Math.min(files.length, limit)} / ${files.length} via presign-upload`);
const token = await login();

let uploaded = 0;
let skipped = 0;
let failed = 0;

for (const file of files) {
  if (uploaded + skipped + failed >= limit) break;
  const key = toKey(file);
  const ext = extname(file).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
  try {
    if (!force && (await alreadyPublic(key))) {
      skipped++;
      process.stdout.write(".");
      continue;
    }
    const signedUrl = await presign(token, key, contentType);
    const body = readFileSync(file);
    await put(signedUrl, body, contentType);
    uploaded++;
    process.stdout.write("+");
  } catch (err) {
    failed++;
    console.error(`\nFAIL ${basename(file)} → ${key}: ${err.message}`);
  }
}

console.log(`\nDone. uploaded=${uploaded} skipped=${skipped} failed=${failed}`);
