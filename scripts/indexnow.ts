/**
 * `pnpm indexnow` — tell Bing (and Yandex, Seznam, Naver, Yep) that pages
 * changed. Run after each production deploy (Bing guideline 4: notify on add,
 * update AND delete). Google does not use IndexNow; it relies on links + sitemap.
 * Reads the built sitemap so the list always matches what was deployed.
 */
import { readFileSync } from "node:fs";
import { SITE } from "../app/content/site";

const KEY = "1f61621f4e039990e2bafab49f459187"; // also served at /1f61621f4e039990e2bafab49f459187.txt (public/)
const host = new URL(SITE.url).host;
const urlList = [...readFileSync("build/client/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE.url}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs for ${host} → HTTP ${res.status}`);
if (res.status >= 400) process.exit(1);
