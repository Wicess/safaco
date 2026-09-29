// Vercel Function entry: the whole Express app is one function at /api/*.
// (vercel.json rewrites /api/(.*) here.) Pages are static and never hit this.
import { app } from "../server/app";

export default app;
