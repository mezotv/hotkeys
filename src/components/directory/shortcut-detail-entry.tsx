"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import type { Company, ShortcutBinding } from "@/lib/types";
import { cn } from "@/utils/cn";
import { getCompanyIconUrl } from "@/utils/icons";
import { useHotkeyStates } from "./hotkey-highlight";

export function ShortcutDetailEntry({
  binding,
  company,
  highlightId,
}: {
  binding: ShortcutBinding;
  company: Company;
  highlightId: string;
}) {
  const keyStates = useHotkeyStates(highlightId, binding.keys.length);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              alt=""
              aria-hidden="true"
              className="rounded-md"
              height={28}
              src={getCompanyIconUrl(company)}
              unoptimized
              width={28}
            />
            <div className="min-w-0">
              <Link
                className="text-sm font-semibold tracking-tight text-zinc-950 transition hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
                href={`/companies/${company.slug}`}
              >
                {company.name}
              </Link>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {binding.contextLabel}
              </p>
            </div>
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
        </div>
        {binding.note ? (
          <p className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {binding.note}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
