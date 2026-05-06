"use client";

import { Kbd } from "@/components/ui/kbd";
import type { ShortcutBinding } from "@/lib/types";
import { cn } from "@/utils/cn";
import { useHotkeyStates } from "./hotkey-highlight";

export function CompanyDetailBinding({
  binding,
  highlightId,
}: {
  binding: ShortcutBinding;
  highlightId: string;
}) {
  const keyStates = useHotkeyStates(highlightId, binding.keys.length);

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-black",
      )}
    >
      <div className="min-w-0 text-xs text-zinc-500 dark:text-zinc-400">
        {binding.contextLabel}
        {binding.note ? <p className="mt-1 leading-5">{binding.note}</p> : null}
      </div>
      <div className="ml-auto flex min-w-0 shrink-0 flex-wrap justify-end gap-1">
        {binding.keys.map((key, index) => (
          <Kbd
            className={cn(
              "transition duration-150",
              keyStates[index] === "partial" &&
                "border-orange-300 bg-orange-100 text-orange-950 shadow-orange-200 dark:border-orange-400/60 dark:bg-orange-950/50 dark:text-orange-100",
              keyStates[index] === "complete" &&
                "border-emerald-300 bg-emerald-100 text-emerald-950 shadow-emerald-200 dark:border-emerald-400/60 dark:bg-emerald-950/50 dark:text-emerald-100",
            )}
            key={`${binding.context}-${key}`}
          >
            {key}
          </Kbd>
        ))}
      </div>
    </li>
  );
}
