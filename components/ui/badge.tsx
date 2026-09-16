import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        muted: "bg-secondary text-muted-foreground",
        sage: "bg-sage/20 text-sage",
        warn: "bg-warn/20 text-warn",
        danger: "bg-destructive/20 text-destructive",
        outline: "shadow-[var(--shadow-border)] text-muted-foreground",
      },
    },
    defaultVariants: { variant: "muted" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
