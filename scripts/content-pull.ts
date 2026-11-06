/**
 * `pnpm content:pull` (runs first in `pnpm build`): downloads the content the
 * admin last PUBLISHED (R2 site/content.json) into
 * app/content/overrides.generated.json, which the prerendered pages read.
 * Then clears the "publish pending" marker the Ignored Build Step looks for.
 *
 * No R2 credentials → keeps the code defaults (writes {} if missing).
 * R2 configured but unreachable → FAILS the build rather than silently
 * shipping a site without the owner's edits.
 */
import "dotenv/config";
import { existsSync, writeFileSync } from "node:fs";
import { deleteKeys, getJson, r2Configured } from "../server/lib/r2";

const OUT = "app/content/overrides.generated.json";

if (!r2Configured()) {
  if (!existsSync(OUT)) writeFileSync(OUT, "{}\n");
  console.log("content-pull: R2 not configured, using code defaults");
} else {
  const live = await getJson<Record<string, unknown>>("site/content.json");
  writeFileSync(OUT, JSON.stringify(live ?? {}, null, 2) + "\n");
  if (process.env.VERCEL) await deleteKeys(["site/publish-pending"]).catch(() => {});
  console.log(live ? `content-pull: published content from ${String(live.publishedAt ?? "?")}` : "content-pull: nothing published yet, using code defaults");
}
