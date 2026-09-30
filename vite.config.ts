import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    // Forward the contact form to the local Express server (`pnpm dev:api`).
    proxy: { "/api": "http://localhost:3001" },
    // A production build (incl. the prerender server) never needs file watching;
    // skipping it avoids inotify ENOSPC when other dev servers hold the limit.
    // In dev, don't watch generated images (420+ files).
    watch: command === "build" ? null : { ignored: ["**/public/media/**", "**/media-src/**", "**/build/**"] },
  },
}));
