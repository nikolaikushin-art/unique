#!/usr/bin/env node
/**
 * Download media from the public R2 CDN, generate responsive WebP variants
 * (+ compressed hero MP4), and upload via Supabase r2-storage presign.
 *
 * Usage:
 *   node scripts/optimize-r2-assets.mjs
 *   node scripts/optimize-r2-assets.mjs --limit=20
 *   node scripts/optimize-r2-assets.mjs --skip-video
 *   node scripts/optimize-r2-assets.mjs --force
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvFile(join(ROOT, ".env.local"));
loadEnvFile(join(ROOT, ".env.supabase.local"));
loadEnvFile(join(ROOT, ".env.r2.local"));

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://flqgrcmevbjavafppqmh.supabase.co";
const ANON = process.env.VITE_SUPABASE_ANON_KEY || "";
const EMAIL = process.env.UPLOAD_EMAIL || "info@uniquedetailing.ru";
const PASSWORD = process.env.UPLOAD_PASSWORD || "Unique777";
const PUBLIC_URL = (
  process.env.VITE_CDN_URL ||
  process.env.R2_PUBLIC_URL ||
  "https://pub-d232aa7dc74242bdab9a8077f5ceaefa.r2.dev"
).replace(/\/$/, "");

const WIDTHS = [480, 768, 1080, 1440];
const WEBP_QUALITY = 72;
const CACHE_CONTROL = "public, max-age=31536000, immutable";

const force = process.argv.includes("--force");
const skipVideo = process.argv.includes("--skip-video");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;
const concurrency = Number(
  process.argv.find((a) => a.startsWith("--concurrency="))?.split("=")[1] || 6,
);
const refreshTokenEvery = Number(
  process.argv.find((a) => a.startsWith("--refresh-every="))?.split("=")[1] || 80,
);

const TMP = join(ROOT, ".tmp-r2-optimize");
mkdirSync(TMP, { recursive: true });

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

function slugify(brand, model) {
  return `${brand}-${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Collect every /portfolio|/ppf|/media|/og-cover path referenced in source. */
function collectLocalPaths() {
  const paths = new Set();
  const files = [
    ...walkFiles(join(ROOT, "src")),
    join(ROOT, "DEPLOYMENT.md"),
    join(ROOT, "AGENTS.md"),
  ].filter((f) => existsSync(f) && /\.(ts|tsx|js|jsx|json|md)$/.test(f));

  const re =
    /(?:["'`])(\/(?:portfolio|ppf|media)\/[^"'`\s]+?\.(?:jpe?g|png|webp|mp4|mov)|\/og-cover\.jpg)(?:["'`])/gi;

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(re)) paths.add(m[1]);
  }

  // works.ts builds gallery URLs from STUDIO_VEHICLES via slugify(brand, model).
  // Expand the full known suffix set so every portfolio JPEG gets WebP variants.
  const vehiclesSrc = readFileSync(join(ROOT, "src/lib/studio-vehicles.ts"), "utf8");
  const brands = [...vehiclesSrc.matchAll(/brand:\s*"([^"]+)"/g)].map((m) => m[1]);
  const models = [...vehiclesSrc.matchAll(/model:\s*"([^"]+)"/g)].map((m) => m[1]);
  const count = Math.min(brands.length, models.length);
  const suffixes = [
    "0",
    "1",
    "2",
    "3",
    "ext-1",
    "ext-2",
    "ext-3",
    "craft-1",
    "craft-2",
    "craft-3",
    "craft-4",
    "craft-5",
    "craft-6",
    "det-1",
    "det-2",
    "det-3",
    "det-4",
    "det-5",
    "det-6",
    "int-1",
    "int-2",
    "int-3",
    "int-4",
    "int-5",
  ];
  for (let i = 0; i < count; i++) {
    const slug = slugify(brands[i], models[i]);
    for (const suffix of suffixes) {
      paths.add(`/portfolio/${slug}-${suffix}.jpg`);
    }
  }

  return [...paths];
}

function toR2Key(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p.startsWith("/portfolio/")) return `assets/gallery/${p.slice("/portfolio/".length)}`;
  if (p.startsWith("/ppf/")) return `assets/services/${p.slice("/ppf/".length)}`;
  if (p === "/media/logo.png") return "assets/unique-detailing-logo.png";
  if (p === "/media/numberplate-logo.png") {
    return "assets/unique-detailing-numberplate-logo.png";
  }
  if (p === "/media/hero.mp4" || p === "/media/hero.mov") return "assets/marketing/hero.mp4";
  if (p === "/og-cover.jpg") return "assets/marketing/og-cover.jpg";
  if (p.startsWith("/media/")) return `assets/marketing/${p.slice("/media/".length)}`;
  return null;
}

function variantKey(originalKey, width) {
  return originalKey.replace(/\.(jpe?g|png|webp)$/i, `.w${width}.webp`);
}

async function login() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function headOk(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
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
      cacheControl: CACHE_CONTROL,
      cache_control: CACHE_CONTROL,
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
    headers: {
      "Content-Type": contentType,
      "Cache-Control": CACHE_CONTROL,
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`PUT failed ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

async function uploadBuffer(token, key, body, contentType) {
  const signedUrl = await presign(token, key, contentType);
  await put(signedUrl, body, contentType);
}

async function mapPool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
}

async function optimizeImage(token, localPath) {
  const key = toR2Key(localPath);
  if (!key || !/\.(jpe?g|png)$/i.test(key)) return { skipped: true, reason: "not-image" };

  const srcUrl = `${PUBLIC_URL}/${key}`;
  if (!(await headOk(srcUrl))) return { skipped: true, reason: "missing-source" };

  // Skip if all variants already present (unless --force)
  if (!force) {
    const checks = await Promise.all(
      WIDTHS.map((w) => headOk(`${PUBLIC_URL}/${variantKey(key, w)}`)),
    );
    if (checks.every(Boolean)) return { skipped: true, reason: "variants-exist" };
  }

  const res = await fetch(srcUrl);
  if (!res.ok) return { skipped: true, reason: `fetch-${res.status}` };
  const input = Buffer.from(await res.arrayBuffer());

  let uploaded = 0;
  for (const width of WIDTHS) {
    const outKey = variantKey(key, width);
    if (!force && (await headOk(`${PUBLIC_URL}/${outKey}`))) continue;
    const body = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();
    await uploadBuffer(token, outKey, body, "image/webp");
    uploaded++;
  }

  // Also write a compressed fallback JPEG at 1600px for heavy originals
  if (/\.jpe?g$/i.test(key) && (force || input.length > 180_000)) {
    const compactKey = key.replace(/\.jpe?g$/i, ".w1600.jpg");
    if (force || !(await headOk(`${PUBLIC_URL}/${compactKey}`))) {
      const body = await sharp(input)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toBuffer();
      await uploadBuffer(token, compactKey, body, "image/jpeg");
      uploaded++;
    }
  }

  return { uploaded, key };
}

async function optimizeHeroVideo(token) {
  const key = "assets/marketing/hero.mp4";
  const srcUrl = `${PUBLIC_URL}/${key}`;
  const srcPath = join(TMP, "hero-src.mp4");
  const outPath = join(TMP, "hero-opt.mp4");

  console.log("Downloading hero video…");
  const res = await fetch(srcUrl);
  if (!res.ok) throw new Error(`hero fetch ${res.status}`);
  writeFileSync(srcPath, Buffer.from(await res.arrayBuffer()));

  console.log("Compressing hero video with ffmpeg…");
  const ff = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      srcPath,
      "-vf",
      "scale='min(1600,iw)':-2",
      "-c:v",
      "libx264",
      "-profile:v",
      "main",
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "28",
      "-preset",
      "medium",
      "-movflags",
      "+faststart",
      "-an",
      outPath,
    ],
    { encoding: "utf8" },
  );
  if (ff.status !== 0) {
    throw new Error(`ffmpeg failed: ${(ff.stderr || "").slice(-400)}`);
  }

  const body = readFileSync(outPath);
  const before = readFileSync(srcPath).length;
  console.log(
    `Hero video ${(before / 1e6).toFixed(2)}MB → ${(body.length / 1e6).toFixed(2)}MB`,
  );
  await uploadBuffer(token, key, body, "video/mp4");

  // Keep a named optimized copy as well
  await uploadBuffer(token, "assets/marketing/hero.opt.mp4", body, "video/mp4");

  // Update asset JSON size/url metadata
  const assetJson = join(ROOT, "src/assets/hero.mov.asset.json");
  if (existsSync(assetJson)) {
    const meta = JSON.parse(readFileSync(assetJson, "utf8"));
    meta.size = body.length;
    meta.url = `${PUBLIC_URL}/${key}`;
    meta.r2_key = key;
    meta.optimized_at = new Date().toISOString();
    meta.version = (meta.version || 1) + 1;
    writeFileSync(assetJson, `${JSON.stringify(meta, null, 2)}\n`);
  }

  return { before, after: body.length };
}

const imagePaths = collectLocalPaths()
  .filter((p) => /\.(jpe?g|png)$/i.test(p))
  .sort();

console.log(`Found ${imagePaths.length} image path candidates`);
console.log(`CDN ${PUBLIC_URL} · widths ${WIDTHS.join(",")} · concurrency ${concurrency}`);

let token = await login();
console.log("Authenticated for presign uploads");

let processed = 0;
let uploadedVariants = 0;
let skipped = 0;
let failed = 0;
let uploadsSinceRefresh = 0;
const queue = imagePaths.slice(0, Number.isFinite(limit) ? limit : imagePaths.length);

async function getToken() {
  if (uploadsSinceRefresh >= refreshTokenEvery) {
    token = await login();
    uploadsSinceRefresh = 0;
    console.log("\nRefreshed presign auth token");
  }
  return token;
}

await mapPool(queue, concurrency, async (localPath) => {
  try {
    const res = await optimizeImage(await getToken(), localPath);
    if (res.skipped) {
      skipped++;
      process.stdout.write(".");
    } else {
      processed++;
      uploadedVariants += res.uploaded || 0;
      uploadsSinceRefresh += res.uploaded || 0;
      process.stdout.write("+");
    }
  } catch (err) {
    failed++;
    process.stdout.write("!");
    console.error(`\nFAIL ${localPath}: ${err.message}`);
  }
});

console.log(
  `\nImages done. processed=${processed} skipped=${skipped} failed=${failed} variantsUploaded=${uploadedVariants}`,
);

if (!skipVideo) {
  try {
    const v = await optimizeHeroVideo(token);
    console.log(`Hero video optimized and uploaded (${v.before} → ${v.after} bytes)`);
  } catch (err) {
    console.error(`Hero video optimize failed: ${err.message}`);
    process.exitCode = 1;
  }
}

writeFileSync(
  join(TMP, "optimize-summary.json"),
  JSON.stringify(
    {
      at: new Date().toISOString(),
      imageCandidates: imagePaths.length,
      processed,
      skipped,
      failed,
      uploadedVariants,
      widths: WIDTHS,
    },
    null,
    2,
  ),
);
console.log("Summary written to .tmp-r2-optimize/optimize-summary.json");
