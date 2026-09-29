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
  },
});
