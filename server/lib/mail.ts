import { BrevoClient } from "@getbrevo/brevo";
import type { ContactInput } from "../../app/lib/contact-schema";

const DIVISION_LABEL: Record<ContactInput["division"], string> = {
  GROUP: "SAFA & Co",
  CONSTRUCTION: "SAFA Construction",
  APARTMENTS: "SAFA Apartments",
  DESIGNS: "SAFA Designs",
};

/** Where each division's leads go. Falls back to LEADS_TO_DEFAULT. */
function inboxFor(division: ContactInput["division"]): string | undefined {
  return process.env[`LEADS_TO_${division}`] || process.env.LEADS_TO_DEFAULT;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

let client: BrevoClient | null = null;
function brevo(): BrevoClient | null {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return null;
  client ??= new BrevoClient({ apiKey });
  return client;
}

type Geo = { country?: string; city?: string };

/**
 * 1) Notify the division inbox (reply-to = the visitor, when they gave an email).
 * 2) Auto-reply to the visitor in their language, if they gave an email.
 * Returns true when the notification was accepted by Brevo.
 */
export async function sendLeadEmails(lead: ContactInput, geo: Geo): Promise<boolean> {
  const b = brevo();
  const to = inboxFor(lead.division);
  const sender = { email: process.env.MAIL_FROM ?? "no-reply@example.com", name: "SAFA & Co — Site web" };
  if (!b || !to) {
    console.warn("[mail] Brevo not configured — lead stored only");
    return false;
  }
  const division = DIVISION_LABEL[lead.division];
  const wa = lead.phone.replace(/[^\d]/g, "");
  const rows: [string, string][] = [
    ["Division", division + (lead.topic ? ` · ${lead.topic}` : "")],
    ["Nom", lead.name],
    ["Téléphone", lead.phone],
    ["E-mail", lead.email || "—"],
    ["Langue", lead.lang.toUpperCase()],
    ["Localisation", [geo.city, geo.country].filter(Boolean).join(", ") || "—"],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;color:#14202a;max-width:560px">
      <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8a6631;margin:0 0 8px">Nouvelle demande · ${esc(division)}</p>
      <h1 style="font-family:Georgia,serif;font-weight:500;font-size:26px;margin:0 0 20px">${esc(lead.name)}</h1>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5a6570;width:120px">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`).join("")}
      </table>
      <p style="white-space:pre-wrap;font-size:15px;line-height:1.6;border-left:2px solid #b08a50;padding-left:14px;margin:22px 0">${esc(lead.message)}</p>
      <p><a href="https://wa.me/${wa}" style="display:inline-block;background:#1f7a4d;color:#fff;padding:12px 18px;text-decoration:none;font-size:13px;letter-spacing:.1em;text-transform:uppercase">Répondre sur WhatsApp</a></p>
    </div>`;

  try {
    await b.transactionalEmails.sendTransacEmail({
      sender,
      to: [{ email: to }],
      replyTo: lead.email ? { email: lead.email, name: lead.name } : undefined,
      subject: `[${division}] ${lead.name} — ${lead.phone}`,
      htmlContent: html,
      tags: ["lead", lead.division.toLowerCase()],
    });
  } catch (err) {
    console.error("[mail] notification failed", err);
    return false;
  }

  if (lead.email) {
    const fr = lead.lang === "fr";
    const reply = `
      <div style="font-family:Arial,sans-serif;color:#14202a;max-width:560px;line-height:1.6">
        <p style="font-family:Georgia,serif;font-size:24px;margin:0 0 16px">${fr ? "Merci" : "Thank you"}, ${esc(lead.name.split(" ")[0] ?? lead.name)}.</p>
        <p>${
          fr
            ? `Nous avons bien reçu votre demande pour <strong>${esc(division)}</strong>. Notre équipe vous répond rapidement, par téléphone ou sur WhatsApp au ${esc(lead.phone)}.`
            : `We've received your enquiry for <strong>${esc(division)}</strong>. Our team will get back to you shortly, by phone or on WhatsApp at ${esc(lead.phone)}.`
        }</p>
        <p style="color:#5a6570;font-size:13px;margin-top:28px">SAFA &amp; Co SARL · Yaoundé, ${fr ? "Cameroun" : "Cameroon"}</p>
      </div>`;
    try {
      await b.transactionalEmails.sendTransacEmail({
        sender: { ...sender, name: division },
        to: [{ email: lead.email, name: lead.name }],
        replyTo: { email: to, name: division },
        subject: fr ? `Votre demande à ${division}` : `Your enquiry to ${division}`,
        htmlContent: reply,
        tags: ["autoreply"],
      });
    } catch (err) {
      console.error("[mail] auto-reply failed", err); // non-fatal
    }
  }
  return true;
}
