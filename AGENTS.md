# UNIQUE Detailing — engineering notes

Standalone TanStack Start (React 19, SSR) site. Build tooling is native Vite
(`vite.config.ts`) with Tailwind v4 and Nitro. GitHub is the single source of
truth.

- Package manager: `npm` (or `bun`). Build: `npm run build`. Dev: `npm run dev`.
- Deploy target: Vercel. Nitro auto-detects the Vercel environment; you can
  pin it with `NITRO_PRESET=vercel`.
- Heavy media is served from Cloudflare R2 (`VITE_CDN_URL`). Favicons stay in
  `public/`. See `src/lib/cdn.ts` and `scripts/upload-assets-r2.mjs`.
- Set `VITE_SITE_URL` to the production domain for canonical/OG URLs.
- Backend (contact form, public services/staff) uses Supabase via
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `src/lib/supabase.ts`).
- CRM: https://ops.uniquedetailing.ru — separate project; do not overwrite.
- Contact email: info@uniquedetailing.ru
