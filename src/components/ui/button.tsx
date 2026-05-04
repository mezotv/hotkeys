import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium outline-none transition focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:ring-black/[.08] dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 dark:focus-visible:ring-white/[.12]",
        outline:
          "border border-black/[.08] bg-transparent text-zinc-700 hover:border-black/20 hover:text-zinc-950 focus-visible:ring-black/[.04] dark:border-white/[.12] dark:text-zinc-300 dark:hover:border-white/25 dark:hover:text-zinc-50 dark:focus-visible:ring-white/[.08]",
        ghost:
          "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus-visible:ring-white/[.08]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-xs",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<typeof BaseButton> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, size, variant, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(buttonVariants({ size, variant }), className)}
      {...props}
    />
  );
}
