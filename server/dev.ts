// Local API server for `pnpm dev:api` (Vite proxies /api → :3001).
import "dotenv/config";
import { app } from "./app";

const port = Number(process.env.API_PORT ?? 3001);
app.listen(port, () => console.log(`[api] http://localhost:${port}`));
