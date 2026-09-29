import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

// shadcn/ui Button, restyled to the SAFA system: square-shouldered, quiet,
// one clear primary per screen.
const buttonVariants = cva(
  "group/btn relative inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap px-6 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform] duration-300 ease-(--ease-out-quart) active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-navy-900 text-ivory hover:bg-navy-700",
        gold: "bg-gold text-navy-950 hover:bg-gold-300",
        outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
        "outline-light": "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-navy-950",
        link: "min-h-0 px-0 text-ink underline-offset-8 hover:underline",
        whatsapp: "bg-[#1f7a4d] text-white hover:bg-[#186540]",
      },
      size: {
        default: "",
        sm: "min-h-10 px-4 text-[0.75rem]",
        lg: "min-h-14 px-8",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
