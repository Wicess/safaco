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
    return data.success && (!allowed || data.hostname === allowed);
  } catch {
    return false;
  }
}
