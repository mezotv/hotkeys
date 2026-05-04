import type * as React from "react";
import { cn } from "@/utils/cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/[.06] bg-white text-zinc-950 shadow-sm shadow-black/[.02] dark:border-white/[.08] dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-none",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}
