import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    // Forward the contact form to the local Express server (`pnpm dev:api`).
    proxy: { "/api": "http://localhost:3001" },
    // Don't watch generated images — 420+ files exhaust the inotify limit on
    // this machine (ENOSPC) when other dev servers are running.
    watch: { ignored: ["**/public/media/**", "**/media-src/**", "**/build/**"] },
  },
});
