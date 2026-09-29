import { cn } from "~/lib/utils";

/**
 * The SAFA & Co lockup: the client's monogram (raster, extracted from their
 * logo file — replace with the vector original when supplied) + a live-text
 * wordmark set in Cormorant caps, which matches the logo's serif.
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const src = tone === "dark" ? "/brand/safa-monogram-sm" : "/brand/safa-monogram-light-sm";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <picture>
        <source srcSet={`${src}.webp`} type="image/webp" />
        <img src={`${src}.png`} alt="" width={30} height={46} className="h-[46px] w-auto" decoding="async" />
      </picture>
      <span
        className={cn(
          "font-display text-[1.3rem] font-medium leading-none tracking-[0.2em] md:text-[1.45rem]",
          tone === "dark" ? "text-ink" : "text-ivory",
        )}
      >
        SAFA <span className={tone === "dark" ? "text-gold-600" : "text-gold-300"}>&amp;</span> Co
      </span>
    </span>
  );
}
