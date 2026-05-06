"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import type { CompanyWithShortcuts } from "@/lib/types";
import { getCompanyIconUrl } from "@/utils/icons";

const INITIAL_SHORTCUT_ROW_COUNT = 3;

export function CompanyCard({ company }: { company: CompanyWithShortcuts }) {
  const [showAllShortcuts, setShowAllShortcuts] = useState(false);
  const shortcutRows = company.shortcuts.flatMap((shortcut) =>
    shortcut.bindings.map((binding) => ({ binding, shortcut })),
  );
  const hiddenShortcutCount = Math.max(
    shortcutRows.length - INITIAL_SHORTCUT_ROW_COUNT,
    0,
  );
  const visibleShortcutRows = showAllShortcuts
    ? shortcutRows
    : shortcutRows.slice(0, INITIAL_SHORTCUT_ROW_COUNT);

  return (
    <Card className="transition hover:border-black/[.12] dark:hover:border-white/[.16]">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Image
            alt=""
            aria-hidden="true"
            className="rounded-md"
            height={28}
            src={getCompanyIconUrl(company)}
            unoptimized
            width={28}
          />
          <div className="flex flex-col leading-tight">
            <Link
              className="text-base font-semibold tracking-tight text-zinc-950 transition hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
              href={`/companies/${company.slug}`}
            >
              {company.name}
            </Link>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {company.category} / {company.shortcuts.length} shortcut
              {company.shortcuts.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {company.description}
        </p>

        <ul className="space-y-2">
          {visibleShortcutRows.map(({ binding, shortcut }) => (
            <li
              className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-black"
              key={`${shortcut.id}-${binding.context}`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  {shortcut.action}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {binding.contextLabel}
                </p>
              </div>
              <div className="ml-auto flex min-w-0 shrink-0 flex-wrap justify-end gap-1">
                {binding.keys.map((key) => (
                  <Kbd key={`${binding.context}-${key}`}>{key}</Kbd>
                ))}
              </div>
            </li>
          ))}
        </ul>

        {showAllShortcuts || hiddenShortcutCount === 0 ? null : (
          <button
            className="w-full rounded-xl border border-black/[.08] bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-black/[.14] hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/[.08] dark:border-white/[.10] dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-white/[.18] dark:hover:text-zinc-50 dark:focus-visible:ring-white/[.12]"
            onClick={() => setShowAllShortcuts(true)}
            type="button"
          >
            Load {hiddenShortcutCount} more shortcut
            {hiddenShortcutCount === 1 ? "" : "s"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
