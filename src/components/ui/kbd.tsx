import type * as React from "react";
import { cn } from "@/utils/cn";

export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-6 items-center justify-center rounded-md border border-black/10 bg-white px-1.5 py-0.5 font-mono text-[11px] font-medium text-zinc-900 shadow-sm dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100",
        className,
      )}
      {...props}
    />
  );
}

export function KbdChord({
  className,
  keyClassName,
  keys,
}: {
  className?: string;
  keyClassName?: string;
  keys: string[];
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-white shadow-sm dark:bg-zinc-900",
        className,
      )}
    >
      {keys.map((key, index) => (
        <span
          className="inline-flex items-center gap-1"
          key={`${key}-${index}`}
        >
          {index > 0 ? (
            <span className="font-mono text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
              +
            </span>
          ) : null}
          <Kbd className={cn("border-0 shadow-none", keyClassName)}>{key}</Kbd>
        </span>
      ))}
    </span>
  );
}

export function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center -space-x-1.5 *:ring-2 *:ring-white dark:*:ring-zinc-950",
        className,
      )}
      {...props}
    />
  );
}
