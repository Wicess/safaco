/** Cloudflare Turnstile server-side verification. Tokens are single-use, 300 s. */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured (local dev / before keys are provided)
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(6000),
    });
    const data = (await res.json()) as { success: boolean; hostname?: string };
    const allowed = process.env.TURNSTILE_HOSTNAME;
    // The bare domain and its www twin are the same site (one redirects to
    // the other), so either hostname is accepted.
    const host = (data.hostname ?? "").replace(/^www\./, "");
    return data.success && (!allowed || host === allowed.replace(/^www\./, ""));
  } catch {
    return false;
  }
}
