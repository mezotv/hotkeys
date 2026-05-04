import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium transition",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400",
        outline:
          "border border-black/[.08] text-zinc-600 dark:border-white/[.12] dark:text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
