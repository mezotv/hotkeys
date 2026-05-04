import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import type { CompanyWithShortcuts } from "@/lib/types";
import { getCompanyIconUrl } from "@/utils/icons";

export function CompanyCard({ company }: { company: CompanyWithShortcuts }) {
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
            <a
              className="text-base font-semibold tracking-tight text-zinc-950 transition hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
              href={company.website}
              rel="noreferrer"
              target="_blank"
            >
              {company.name}
            </a>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {company.category} / {company.shortcuts.length} shortcut
              {company.shortcuts.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <ul className="space-y-2">
          {company.shortcuts.flatMap((shortcut) =>
            shortcut.bindings.map((binding) => (
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
                <div className="flex flex-wrap justify-end gap-1">
                  {binding.keys.map((key) => (
                    <Kbd key={`${binding.context}-${key}`}>{key}</Kbd>
                  ))}
                </div>
              </li>
            )),
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
