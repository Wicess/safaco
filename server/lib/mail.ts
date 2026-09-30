import nodemailer, { type Transporter } from "nodemailer";
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

/**
 * Plain SMTP through the domain's own mailbox (Hostinger for mimosalsd.com:
 * smtp.hostinger.com, 465/SSL, user = the full address). One transporter per
 * function instance; no pool, since a serverless function sends a couple of
 * mails and exits.
 */
let transporter: Transporter | null = null;
function smtp(): Transporter | null {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
  return transporter;
}

type Geo = { country?: string; city?: string };

/**
 * 1) Notify the division inbox (reply-to = the visitor, when they gave an email).
 * 2) Auto-reply to the visitor in their language, if they gave an email.
 * Returns true when the notification was accepted by the SMTP server.
 */
export async function sendLeadEmails(lead: ContactInput, geo: Geo): Promise<boolean> {
  const t = smtp();
  const to = inboxFor(lead.division);
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "";
  if (!t || !to || !from) {
    console.warn("[mail] SMTP not configured — lead stored only");
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
    await t.sendMail({
      from: { name: "SAFA & Co — Site web", address: from },
      to,
      replyTo: lead.email ? { name: lead.name, address: lead.email } : undefined,
      subject: `[${division}] ${lead.name} — ${lead.phone}`,
      html,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${lead.message}`,
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
      await t.sendMail({
        from: { name: division, address: from },
        to: { name: lead.name, address: lead.email },
        replyTo: { name: division, address: to },
        subject: fr ? `Votre demande à ${division}` : `Your enquiry to ${division}`,
        html: reply,
      });
    } catch (err) {
      console.error("[mail] auto-reply failed", err); // non-fatal
    }
  }
  return true;
}
