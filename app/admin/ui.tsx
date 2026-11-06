import { Check, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Picture, allMediaNames, registerMedia } from "~/components/ui/Picture";
import { DEFAULT_GALLERY } from "~/content/gallery";
import type { TT } from "~/content/overrides";
import { cn } from "~/lib/utils";
import { api, errorText, shrinkImage } from "./api";
import { useContent } from "./store";

/* ── Basic building blocks: one vocabulary across every admin screen ── */

export function PageTitle({ title, intro, actions }: { title: string; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
      <div>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-ink" style={{ fontFamily: "var(--font-sans)", lineHeight: 1.2 }}>
          {title}
        </h1>
        {intro && <p className="mt-1.5 max-w-2xl text-sm text-muted">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, intro, children, id, className }: { title: string; intro?: ReactNode; children: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={cn("scroll-mt-24 rounded-lg border border-ink/10 bg-white", className)}>
      <header className="border-b border-ink/8 px-5 py-4">
        <h2 className="text-[0.9375rem] font-semibold text-ink" style={{ fontFamily: "var(--font-sans)", lineHeight: 1.3 }}>
          {title}
        </h2>
        {intro && <p className="mt-1 text-[0.8125rem] text-muted">{intro}</p>}
      </header>
      <div className="space-y-5 px-5 py-5">{children}</div>
    </section>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "gold" | "ghost" | "danger" | "outline"; loading?: boolean; size?: "sm" | "md" };
export function Btn({ variant = "outline", loading, size = "md", className, children, disabled, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[background-color,border-color,color,opacity] duration-150 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        size === "sm" ? "min-h-8 px-3 text-[0.8125rem]" : "min-h-10 px-4 text-sm",
        variant === "primary" && "bg-navy-900 text-ivory hover:bg-navy-700",
        variant === "gold" && "bg-gold text-navy-950 hover:bg-gold-300",
        variant === "outline" && "border border-ink/15 bg-white text-ink hover:border-ink/35 hover:bg-ivory",
        variant === "ghost" && "text-ink/75 hover:bg-ink/5 hover:text-ink",
        variant === "danger" && "border border-red-700/25 bg-white text-red-800 hover:bg-red-50",
        className,
      )}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

const inputCls =
  "w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-[0.9375rem] text-ink placeholder:text-ink/40 transition-[border-color,box-shadow] duration-150 hover:border-ink/30 focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15";

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: ReactNode; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[0.8125rem] font-medium text-ink">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
  autoComplete,
}: {
  label: string;
  hint?: ReactNode;
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      {multiline ? (
        <textarea id={id} className={cn(inputCls, "min-h-24 resize-y leading-relaxed")} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type={type} className={inputCls} value={value ?? ""} placeholder={placeholder} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

/** English + French side by side. Blank = keep the site's current wording
 *  (shown as the placeholder). */
export function BiField({
  label,
  hint,
  value,
  defaults,
  onChange,
  multiline,
}: {
  label: string;
  hint?: ReactNode;
  value: TT | undefined;
  defaults: { en: string; fr: string };
  onChange: (v: TT) => void;
  multiline?: boolean;
}) {
  return (
    <fieldset>
      <legend className="text-[0.8125rem] font-medium text-ink">{label}</legend>
      <div className="mt-1.5 grid gap-3 md:grid-cols-2">
        {(["en", "fr"] as const).map((l) => (
          <BiSide key={l} lang={l} value={value?.[l]} placeholder={defaults[l]} multiline={multiline} onChange={(v) => onChange({ ...value, [l]: v })} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted">{hint ?? "Leave a box empty to keep the current wording (shown in grey)."}</p>
    </fieldset>
  );
}

function BiSide({ lang, value, placeholder, onChange, multiline }: { lang: "en" | "fr"; value?: string; placeholder: string; onChange: (v: string) => void; multiline?: boolean }) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="pointer-events-none absolute right-2 top-2 rounded bg-ink/6 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-ink/55">
        {lang}
      </label>
      {multiline ? (
        <textarea id={id} lang={lang} className={cn(inputCls, "min-h-28 resize-y pr-10 leading-relaxed")} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} lang={lang} className={cn(inputCls, "pr-10")} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-ink/8", className)} />;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "ok" | "warn" | "construction" | "apartments" | "designs" }) {
  const tones = {
    neutral: "bg-ink/6 text-ink/75",
    ok: "bg-emerald-50 text-emerald-800",
    warn: "bg-amber-50 text-amber-900",
    construction: "bg-[#9c4a26]/10 text-[#7a3519]",
    apartments: "bg-[#5f6644]/12 text-[#454a2f]",
    designs: "bg-[#2e3c72]/10 text-[#2e3c72]",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold", tones[tone])}>{children}</span>;
}

/* ── Photos ── */

/** Upload one or more photos; returns the new media names. */
export function useUploader() {
  const { update, notify } = useContent();
  const [busy, setBusy] = useState(0);
  const upload = async (files: FileList | File[]): Promise<string[]> => {
    const names: string[] = [];
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setBusy(list.length);
    for (const f of list) {
      try {
        const blob = await shrinkImage(f);
        const r = await api.upload(blob, f.name);
        registerMedia(r.name, r.entry);
        update((c) => ({ ...c, media: { ...(c.media ?? {}), [r.name]: r.entry } }));
        names.push(r.name);
      } catch (e) {
        notify("error", `${f.name}: ${errorText(e)}`);
      } finally {
        setBusy((n) => n - 1);
      }
    }
    if (names.length) notify("ok", `${names.length} photo${names.length > 1 ? "s" : ""} uploaded.`);
    return names;
  };
  return { upload, busy };
}

export function UploadButton({ onUploaded, label = "Upload photos", multiple = true }: { onUploaded: (names: string[]) => void; label?: string; multiple?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const { upload, busy } = useUploader();
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const files = e.target.files;
          if (files?.length) onUploaded(await upload(files));
          e.target.value = "";
        }}
      />
      <Btn variant="primary" type="button" loading={busy > 0} onClick={() => ref.current?.click()}>
        {busy > 0 ? `Uploading ${busy}…` : (
          <>
            <Upload aria-hidden /> {label}
          </>
        )}
      </Btn>
    </>
  );
}

/** Thumbnail + "Change photo" opening the library (all site photos + uploads). */
export function ImagePicker({ label, hint, value, fallback, onChange }: { label: string; hint?: ReactNode; value?: string; fallback?: string; onChange: (name: string | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const shown = value || fallback;
  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col items-start gap-3">
        <div className="w-32 shrink-0 overflow-hidden rounded-md border border-ink/10 bg-stone">
          {shown ? <Picture name={shown} alt="" sizes="112px" ratio="4/5" /> : <div className="grid aspect-[4/5] place-items-center text-xs text-muted">Video</div>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Btn type="button" size="sm" onClick={() => setOpen(true)}>
            <ImagePlus aria-hidden /> Change photo
          </Btn>
          {value && (
            <Btn type="button" size="sm" variant="ghost" onClick={() => onChange(undefined)}>
              Reset to default
            </Btn>
          )}
        </div>
      </div>
      {open && <MediaLibrary current={shown} onClose={() => setOpen(false)} onPick={(n) => (onChange(n), setOpen(false))} />}
    </Field>
  );
}

function MediaLibrary({ current, onPick, onClose }: { current?: string; onPick: (n: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { content } = useContent();
  const [, force] = useState(0);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  // Uploads first (newest), then the gallery, then any other site photo.
  const names = useMemo(() => {
    const uploads = Object.keys(content.media ?? {}).reverse();
    const gallery = (content.gallery ?? DEFAULT_GALLERY).map((g) => g.image);
    const others = allMediaNames().filter((n) => n.startsWith("safa-") && !n.startsWith("safa-video"));
    return [...new Set([...uploads, ...gallery, ...others])];
  }, [content]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-lg bg-white p-0 text-ink shadow-[0_4px_8px_rgb(12_21_28/0.2)] backdrop:bg-navy-950/60"
      aria-label="Choose a photo"
    >
      <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-4">
        <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-sans)" }}>
          Choose a photo
        </h2>
        <div className="flex items-center gap-2">
          <UploadButton
            multiple={false}
            label="Upload new"
            onUploaded={(n) => {
              force((x) => x + 1);
              if (n[0]) onPick(n[0]);
            }}
          />
          <Btn type="button" variant="ghost" aria-label="Close" onClick={() => ref.current?.close()}>
            <X aria-hidden />
          </Btn>
        </div>
      </div>
      <ul className="grid max-h-[65vh] grid-cols-3 gap-3 overflow-y-auto p-5 sm:grid-cols-4 md:grid-cols-5">
        {names.map((n) => (
          <li key={n}>
            <button
              type="button"
              onClick={() => onPick(n)}
              className={cn("relative block w-full overflow-hidden rounded-md ring-offset-2 transition-shadow hover:ring-2 hover:ring-navy-700/40", n === current && "ring-2 ring-gold-600")}
              aria-label={`Use ${n}`}
              aria-pressed={n === current}
            >
              <Picture name={n} alt="" sizes="160px" ratio="1/1" />
              {n === current && (
                <span className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-gold-600 text-white">
                  <Check className="size-3.5" aria-hidden />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
