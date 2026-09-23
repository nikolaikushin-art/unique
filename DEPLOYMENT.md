# Deployment guide — uniquedetailing.ru

Standalone TanStack Start (React 19, SSR) site. Native Vite + Tailwind v4 + Nitro.
GitHub is the source of truth. Deploy target: Vercel.

## Architecture

Frontend (Vercel) → Supabase (data, auth, edge functions) → Cloudflare R2 (heavy assets).
Email: `info@uniquedetailing.ru` via Resend.
Internal CRM stays at https://ops.uniquedetailing.ru (separate Vercel project).

## Environment variables (Vercel Production)

| Variable | Value |
|---|---|
| `VITE_SITE_URL` | `https://uniquedetailing.ru` |
| `VITE_SUPABASE_URL` | `https://flqgrcmevbjavafppqmh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | publishable / anon key |
| `VITE_CDN_URL` | `https://pub-d232aa7dc74242bdab9a8077f5ceaefa.r2.dev` |
| `VITE_ASSET_BASE_URL` | same as CDN |
| `VITE_LOGO_URL` | `https://pub-d232aa7dc74242bdab9a8077f5ceaefa.r2.dev/assets/unique-detailing-logo.png` |
| `VITE_OPS_URL` | `https://ops.uniquedetailing.ru` |
| `VITE_CONTACT_EMAIL` | `info@uniquedetailing.ru` |

## Build

```bash
npm install
npm run build   # Nitro auto-detects Vercel; or NITRO_PRESET=vercel npm run build
npm run lint
```

## Supabase

Contact form → RPC `submit_website_lead` → `public.leads` (`source=website`).
Public reads: `services`, `service_packages`, `staff` (active rows), selected `studio_settings`.
Migration: `supabase/migrations/20260721_public_website_rls.sql`.

## Cloudflare R2

Upload script: `node scripts/upload-assets-r2.mjs` (credentials in `.env.r2.local`).
Path map:

- `/portfolio/*` → `assets/gallery/*`
- `/ppf/*` → `assets/services/*`
- `/media/logo.png` → `assets/unique-detailing-logo.png`
- `/media/hero.mp4` → `assets/marketing/hero.mp4`
- `/og-cover.jpg` → `assets/marketing/og-cover.jpg`

CDN helper: `src/lib/cdn.ts`.

## DNS (Timeweb)

Keep ops + email records. Public site:

- `A @` → `76.76.21.21`
- `CNAME www` → `cname.vercel-dns.com`
- Keep `CNAME ops` → existing Vercel target

Email (Resend / SES): MX + SPF + DKIM on `send` / `resend._domainkey` — do not remove.

## Domains on Vercel

Project: `uniquedetailingfinal` (do **not** attach to `unique-operations`).

- `uniquedetailing.ru`
- `www.uniquedetailing.ru` → redirect to apex
