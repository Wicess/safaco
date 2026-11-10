import { ArrowUpRight, Mail, MessageCircle, Phone, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CONTACT_FAB, greeting, telLink, waLink } from "~/content/site";
import type { Lang } from "~/lib/i18n";
import { cn } from "~/lib/utils";
import { WhatsAppIcon } from "../ui/icons";

/**
 * Floating contact launcher, after the WHAM chat launcher: a 56px round
 * button with a light travelling around its border and soft rings pulsing
 * out. It can be dragged anywhere on screen (a drag never counts as a tap)
 * and remembers where it was left. A tap opens three ways to reach SAFA:
 * WhatsApp, a call, an e-mail (numbers set in admin → Contact & details).
 */

const SIZE = 56;
const MARGIN = 20;
const KEY = "safa_fab_pos";

const T = {
  open: { en: "Contact us", fr: "Nous contacter" },
  close: { en: "Close", fr: "Fermer" },
  title: { en: "Talk to SAFA & Co", fr: "Parlons de votre projet" },
  sub: { en: "We answer quickly, in French or English.", fr: "Nous répondons vite, en français ou en anglais." },
  wa: { en: "WhatsApp", fr: "WhatsApp" },
  waNote: { en: "The fastest way", fr: "Le plus rapide" },
  call: { en: "Call us", fr: "Appeler" },
  mail: { en: "E-mail", fr: "E-mail" },
} as const;

type Pos = { x: number; y: number };

function clamp(p: Pos): Pos {
  if (typeof window === "undefined") return p;
  const maxLeft = -(window.innerWidth - SIZE - MARGIN * 2);
  const maxUp = -(window.innerHeight - SIZE - MARGIN * 2);
  return { x: Math.min(0, Math.max(maxLeft, p.x)), y: Math.min(0, Math.max(maxUp, p.y)) };
}

export function ContactFab({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean; id: number } | null>(null);
  const suppressClick = useRef(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ above: boolean; alignRight: boolean }>({ above: true, alignRight: true });
  const panelId = useId();

  // Restore the last position, kept inside the current screen.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPos(clamp(JSON.parse(raw) as Pos));
    } catch {
      /* private mode: the button starts in its corner */
    }
    const onResize = () => setPos((p) => clamp(p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (close(), btn.current?.focus());
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false, id: e.pointerId };
    // Capture from the first touch so a quick drag can't slip off the button.
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
      setOpen(false);
    }
    setPos(clamp({ x: d.ox + dx, y: d.oy + dy }));
  };
  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!d?.moved) return;
    suppressClick.current = true;
    setDragging(false);
    setPos((p) => {
      try {
        localStorage.setItem(KEY, JSON.stringify(p));
      } catch {
        /* no storage: it starts in its corner next time */
      }
      return p;
    });
  };
  const onClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const r = btn.current?.getBoundingClientRect();
    if (r) setPlace({ above: r.top > window.innerHeight / 2, alignRight: r.left + r.width / 2 > window.innerWidth / 2 });
    setOpen((o) => !o);
  };

  const { phone, whatsapp, email } = CONTACT_FAB;
  const options = [
    whatsapp && {
      key: "wa",
      href: waLink(whatsapp, greeting("group", lang)),
      external: true,
      icon: <WhatsAppIcon className="size-5" />,
      tone: "bg-[#1f7a4d] text-white",
      label: T.wa[lang],
      value: T.waNote[lang],
    },
    phone && {
      key: "call",
      href: telLink(phone),
      external: false,
      icon: <Phone className="size-[1.125rem]" aria-hidden />,
      tone: "bg-navy-900 text-gold-300",
      label: T.call[lang],
      value: phone,
    },
    email && {
      key: "mail",
      href: `mailto:${email}`,
      external: false,
      icon: <Mail className="size-[1.125rem]" aria-hidden />,
      tone: "bg-gold text-navy-950",
      label: T.mail[lang],
      value: email,
    },
  ].filter(Boolean) as { key: string; href: string; external: boolean; icon: React.ReactNode; tone: string; label: string; value: string }[];

  if (!options.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-live="polite">
      <div className="absolute bottom-5 right-5" style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}>
        {open && (
          <div
            ref={panel}
            id={panelId}
            role="dialog"
            aria-label={T.title[lang]}
            className={cn(
              "fab-panel fab-glow pointer-events-auto absolute w-[min(18rem,calc(100vw-2.5rem))] rounded-3xl",
              place.above ? "bottom-[calc(100%+0.875rem)]" : "top-[calc(100%+0.875rem)]",
              place.alignRight ? "right-0 origin-bottom-right" : "left-0 origin-bottom-left",
            )}
          >
            <div className="overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-[0_20px_60px_rgb(12_21_28/0.32)]">
              <div className="on-dark flex items-start justify-between gap-3 bg-navy-950 px-4 py-3.5 text-ivory">
                <div className="flex items-center gap-3">
                  <img src="/brand/safa-monogram-light-sm.png" alt="" width={21} height={32} className="h-8 w-auto" />
                  <div>
                    <p className="font-display text-[1.125rem] leading-tight">{T.title[lang]}</p>
                    <p className="mt-0.5 text-xs text-ivory/70">{T.sub[lang]}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (close(), btn.current?.focus())}
                  aria-label={T.close[lang]}
                  className="-mr-1.5 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-ivory/60 transition-colors hover:bg-ivory/10 hover:text-ivory"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <ul className="divide-y divide-ink/8 p-1.5">
                {options.map((o) => (
                  <li key={o.key}>
                    <a
                      href={o.href}
                      {...(o.external ? { target: "_blank", rel: "noopener" } : {})}
                      onClick={close}
                      className="group flex min-h-16 items-center gap-3.5 rounded-2xl px-2.5 py-2 transition-colors hover:bg-ink/[0.04] active:bg-ink/[0.07]"
                    >
                      <span className={cn("grid size-11 shrink-0 place-items-center rounded-full", o.tone)}>{o.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.9375rem] font-semibold text-ink">{o.label}</span>
                        <span className="block truncate text-[0.8125rem] text-muted">{o.value}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-ink/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button
          ref={btn}
          type="button"
          aria-label={open ? T.close[lang] : T.open[lang]}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={onClick}
          className={cn(
            "fab-in fab-glow fab-glow-strong pointer-events-auto relative grid size-14 touch-none select-none place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-gold/40",
            dragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {/* Rings pulsing outward, as on the WHAM launcher; still while open or dragged. */}
          {!open && !dragging && (
            <>
              <span aria-hidden className="fab-ring" />
              <span aria-hidden className="fab-ring [animation-delay:1.6s]" />
              <span aria-hidden className="fab-ring [animation-delay:3.2s]" />
            </>
          )}
          <span
            className={cn(
              "relative z-10 grid size-full place-items-center rounded-full bg-navy-950 text-gold-300 shadow-[0_10px_28px_rgb(0_0_0/0.4)] transition-[background-color,color,transform] duration-200",
              dragging ? "scale-110" : "hover:bg-navy-800 active:scale-90",
            )}
          >
            {open ? <X className="size-6" aria-hidden /> : <MessageCircle className="size-6" aria-hidden />}
          </span>
        </button>
      </div>
    </div>
  );
}
