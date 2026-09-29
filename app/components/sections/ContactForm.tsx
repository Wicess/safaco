import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { DIVISIONS, greeting, waLink } from "~/content/site";
import { FIELD_ERRORS } from "~/lib/contact-schema";
import { href, type Lang } from "~/lib/i18n";
import { cn } from "~/lib/utils";
import { WhatsAppIcon } from "../ui/icons";

const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

type Field = "name" | "phone" | "email" | "message";

const DIV_PARAM: Record<string, string> = { construction: "CONSTRUCTION", apartments: "APARTMENTS", designs: "DESIGNS" };

/**
 * Enquiry form. Progressive enhancement:
 *  - No JS: a normal POST to /api/contact, which answers with a 303 redirect.
 *  - JS: validated inline, sent with fetch, then routed to the thank-you page.
 * If the API is down, the visitor is offered WhatsApp instead — never a dead end.
 */
export function ContactForm({ lang }: { lang: Lang }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [division, setDivision] = useState("GROUP");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const [ts, setTs] = useState("");

  useEffect(() => {
    const d = params.get("d");
    if (d && DIV_PARAM[d]) setDivision(DIV_PARAM[d]);
    const t = params.get("t");
    if (t) setTopic(t.slice(0, 40));
    setTs(String(Date.now()));
    if (params.get("error")) setStatus("failed");
  }, [params]);

  useEffect(() => {
    if (!TURNSTILE_KEY || document.getElementById("cf-turnstile-js")) return;
    const s = document.createElement("script");
    s.id = "cf-turnstile-js";
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  function validate(fd: FormData) {
    const e: Partial<Record<Field, string>> = {};
    if (String(fd.get("name") ?? "").trim().length < 2) e.name = FIELD_ERRORS.name[lang];
    if (!/^\+?[\d\s().-]{8,24}$/.test(String(fd.get("phone") ?? "").trim())) e.phone = FIELD_ERRORS.phone[lang];
    const email = String(fd.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = FIELD_ERRORS.email[lang];
    if (String(fd.get("message") ?? "").trim().length < 5) e.message = FIELD_ERRORS.message[lang];
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      if (!res.ok) throw new Error(String(res.status));
      navigate(href("thanks", lang));
    } catch {
      setStatus("failed");
    }
  }

  const divKey = (Object.keys(DIV_PARAM).find((k) => DIV_PARAM[k] === division) ?? undefined) as keyof typeof DIVISIONS | undefined;
  const wa = divKey ? DIVISIONS[divKey].whatsapp : DIVISIONS.construction.whatsapp;

  const label = "eyebrow mb-3 block text-ink/70";
  const input =
    "block w-full min-h-12 border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-[1.0625rem] text-ink placeholder:text-ink/35 focus:border-gold-600 focus:outline-none focus:ring-0 aria-[invalid=true]:border-[#a1301d]";

  return (
    <form ref={formRef} action="/api/contact" method="post" onSubmit={onSubmit} noValidate className="space-y-9">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="page" value={href("contact", lang)} />
      <input type="hidden" name="ts" value={ts} />
      <input type="hidden" name="topic" value={topic} />
      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="division" className={label}>
          {lang === "fr" ? "Votre demande concerne" : "Your enquiry is about"}
        </label>
        <select id="division" name="division" value={division} onChange={(e) => setDivision(e.target.value)} className={cn(input, "cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2314202a%22%20stroke-width=%222%22%3E%3Cpath%20d=%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[right_0.25rem_center] bg-no-repeat pr-8")}>
          <option value="CONSTRUCTION">{lang === "fr" ? "SAFA Construction — location de matériel" : "SAFA Construction — equipment hire"}</option>
          <option value="APARTMENTS">{lang === "fr" ? "SAFA Apartments — séjour" : "SAFA Apartments — a stay"}</option>
          <option value="DESIGNS">{lang === "fr" ? "SAFA Designs — couture ou formation" : "SAFA Designs — tailoring or training"}</option>
          <option value="GROUP">{lang === "fr" ? "Autre / le groupe" : "Other / the group"}</option>
        </select>
      </div>

      <div className="grid gap-9 md:grid-cols-2">
        <FieldBox id="name" label={lang === "fr" ? "Nom complet" : "Full name"} error={errors.name} labelClass={label}>
          <input id="name" name="name" autoComplete="name" required className={input} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
        </FieldBox>
        <FieldBox id="phone" label={lang === "fr" ? "Téléphone / WhatsApp" : "Phone / WhatsApp"} error={errors.phone} labelClass={label}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+237 6__ __ __ __"
            required
            className={input}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-err" : undefined}
          />
        </FieldBox>
      </div>

      <FieldBox id="email" label={lang === "fr" ? "E-mail (facultatif)" : "Email (optional)"} error={errors.email} labelClass={label}>
        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" className={input} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
      </FieldBox>

      <FieldBox id="message" label={lang === "fr" ? "Votre message" : "Your message"} error={errors.message} labelClass={label}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={
            lang === "fr"
              ? "Ex. : chantier à Odza, environ 800 m² à crépir, à partir du 15 du mois prochain."
              : "E.g. site in Odza, about 800 m² to render, from the 15th of next month."
          }
          className={cn(input, "resize-y")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-err" : undefined}
        />
      </FieldBox>

      {TURNSTILE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-language={lang} data-theme="light" />}

      {status === "failed" && (
        <div role="alert" className="border-l-2 border-[#a1301d] bg-[#a1301d]/5 p-5 text-[0.9375rem]">
          <p className="font-medium">
            {lang === "fr" ? "Le message n'a pas pu partir. Écrivez-nous directement sur WhatsApp :" : "Your message couldn't be sent. Message us directly on WhatsApp instead:"}
          </p>
          <a href={waLink(wa, greeting(divKey ?? "group", lang))} rel="noopener" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-[#1f7a4d] underline underline-offset-4">
            <WhatsAppIcon className="size-5" /> WhatsApp
          </a>
        </div>
      )}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-14 items-center justify-center gap-3 bg-navy-900 px-8 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-navy-700 disabled:opacity-60"
        >
          {status === "sending" ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
          {status === "sending" ? (lang === "fr" ? "Envoi…" : "Sending…") : lang === "fr" ? "Envoyer la demande" : "Send enquiry"}
          {status !== "sending" && <ArrowRight className="size-4" aria-hidden />}
        </button>
        <p className="max-w-xs text-xs leading-relaxed text-muted">
          {lang === "fr"
            ? "Nous utilisons vos coordonnées uniquement pour répondre à votre demande."
            : "We use your details only to reply to your enquiry."}
        </p>
      </div>
    </form>
  );
}

function FieldBox({ id, label, error, labelClass, children }: { id: string; label: string; error?: string; labelClass: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-[#a1301d]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
