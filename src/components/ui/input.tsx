import { Input as BaseInput } from "@base-ui/react/input";
import type * as React from "react";
import { cn } from "@/utils/cn";

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<typeof BaseInput>) {
  return (
    <BaseInput
      className={cn(
        "h-12 w-full rounded-2xl border border-black/[.08] bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-black/20 focus:ring-4 focus:ring-black/[.04] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[.12] dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-white/25 dark:focus:ring-white/[.06]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
