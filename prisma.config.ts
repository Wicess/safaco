import "dotenv/config";
import { defineConfig } from "prisma/config";

// The CLI (migrations) uses the DIRECT Neon URL. The app itself connects through
// the pooled URL via @prisma/adapter-neon (see server/lib/db.ts).
// `prisma generate` needs no URL, so a missing value is allowed at build time.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL_UNPOOLED ?? "" },
});
