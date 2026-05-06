import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import type { CompanyWithShortcuts } from "@/lib/types";
import { getCompanyIconUrl } from "@/utils/icons";

export function CompanyDetail({ company }: { company: CompanyWithShortcuts }) {
  return (
    <article className="py-12 sm:py-16">
      <Link
        className="text-sm text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        href="/"
      >
        ← all companies
      </Link>

      <header className="mt-6 flex items-start gap-4">
        <Image
          alt=""
          aria-hidden="true"
          className="rounded-xl"
          height={56}
          src={getCompanyIconUrl(company)}
          unoptimized
          width={56}
        />
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            {company.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {company.category} ·{" "}
            <a
              className="underline decoration-black/20 transition hover:text-zinc-950 hover:decoration-black dark:decoration-white/25 dark:hover:text-zinc-50 dark:hover:decoration-white"
              href={company.website}
              rel="noreferrer"
              target="_blank"
            >
              {new URL(company.website).hostname.replace(/^www\./, "")}
            </a>
          </p>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Shortcuts
        </h2>

        {company.shortcuts.length === 0 ? (
          <Card className="mt-3">
            <CardContent className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
              No shortcuts yet.
            </CardContent>
          </Card>
        ) : (
          <ul className="mt-3 space-y-3">
            {company.shortcuts.map((shortcut) => (
              <li key={shortcut.id}>
                <Card>
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          className="text-base font-semibold tracking-tight text-zinc-950 transition hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
                          href={`/shortcuts/${shortcut.id}`}
                        >
                          {shortcut.action}
                        </Link>
                        <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                          {shortcut.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {shortcut.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {shortcut.bindings.map((binding) => (
                        <li
                          className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-black"
                          key={`${shortcut.id}-${binding.context}`}
                        >
                          <div className="min-w-0 text-xs text-zinc-500 dark:text-zinc-400">
                            {binding.contextLabel}
                            {binding.note ? (
                              <p className="mt-1 leading-5">{binding.note}</p>
                            ) : null}
                          </div>
                          <div className="ml-auto flex min-w-0 shrink-0 flex-wrap justify-end gap-1">
                            {binding.keys.map((key) => (
                              <Kbd key={`${binding.context}-${key}`}>{key}</Kbd>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
