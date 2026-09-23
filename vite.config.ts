import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Standalone Vite config — TanStack Start (SSR) + React + Tailwind v4 +
// tsconfig path aliases, built through Nitro. The deploy target is
// auto-detected by Nitro (Vercel sets `VERCEL=1`); override locally with
// `NITRO_PRESET=vercel npm run build` if desired.
export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Route TanStack Start's server entry to src/server.ts (SSR error wrapper).
      server: { entry: "server" },
    }),
    viteReact(),
    nitro({ preset: process.env.NITRO_PRESET }),
  ],
});
