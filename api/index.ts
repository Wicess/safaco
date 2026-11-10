// Vercel Function entry: the whole Express app is one function at /api/*.
// (vercel.json rewrites /api/(.*) here.) Pages are static and never hit this.
//
// The server is pre-bundled into one ESM file by `pnpm build:api` (run in
// postinstall and in build). The project is "type": "module" and the server
// source uses extensionless imports, which Node's ESM loader rejects at
// runtime; a single bundle sidesteps that entirely.
// @ts-ignore: generated file, see build:api
import { app } from "../server/dist/app.mjs";

export default app;
