#!/usr/bin/env node
/**
 * Upload public site media to Cloudflare R2 (S3-compatible).
 * Loads credentials from .env.r2.local (never committed).
 *
 * Usage: node scripts/upload-assets-r2.mjs
 */
import { createReadStream, existsSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

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

loadEnvFile(new URL("../.env.r2.local", import.meta.url).pathname);
loadEnvFile(new URL("../.env.local", import.meta.url).pathname);

const {
  R2_ACCOUNT_ID,
  R2_BUCKET,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_S3_ENDPOINT,
  R2_PUBLIC_URL,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_BUCKET || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("Missing R2 credentials in .env.r2.local");
  process.exit(1);
}

const endpoint =
  R2_S3_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const publicUrl = (R2_PUBLIC_URL || "").replace(/\/$/, "");

const client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

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

/** Local path → R2 object key */
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

async function exists(key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(absPath, key, { force = false } = {}) {
  if (!force && (await exists(key))) {
    return { key, skipped: true };
  }
  const ext = extname(absPath).toLowerCase();
  const Body = createReadStream(absPath);
  const ContentType = CONTENT_TYPES[ext] || "application/octet-stream";
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body,
      ContentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return { key, skipped: false };
}

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

const sources = [
  join(ROOT, "public/portfolio"),
  join(ROOT, "public/ppf"),
  join(ROOT, "public/media"),
  join(ROOT, "public/og-cover.jpg"),
].filter((p) => existsSync(p));

const files = [];
for (const src of sources) {
  const st = statSync(src);
  if (st.isDirectory()) files.push(...walk(src));
  else files.push(src);
}

console.log(`Found ${files.length} files to map → R2 bucket ${R2_BUCKET}`);

let uploaded = 0;
let skipped = 0;
let failed = 0;
const mapping = [];

for (const file of files) {
  const key = toKey(file);
  if (!key) continue;
  const localRel = relative(ROOT, file).replace(/\\/g, "/");
  mapping.push({ local: localRel, key, url: `${publicUrl}/${key}` });
  if (dryRun) {
    console.log(`[dry-run] ${localRel} → ${key}`);
    continue;
  }
  try {
    const res = await uploadFile(file, key, { force });
    if (res.skipped) {
      skipped++;
      process.stdout.write(".");
    } else {
      uploaded++;
      process.stdout.write("+");
    }
  } catch (err) {
    failed++;
    console.error(`\nFAIL ${localRel}: ${err.message}`);
  }
}

console.log(`\nDone. uploaded=${uploaded} skipped=${skipped} failed=${failed}`);
if (dryRun) {
  console.log(JSON.stringify(mapping.slice(0, 20), null, 2));
}
