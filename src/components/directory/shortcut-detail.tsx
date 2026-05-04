import Image from "next/image";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import type { ShortcutGroup } from "@/lib/types";
import { getCompanyIconUrl } from "@/utils/icons";

function uniqueChords(group: ShortcutGroup) {
  const seen = new Map<string, string[]>();

  for (const { shortcut } of group.entries) {
    for (const binding of shortcut.bindings) {
      const signature = binding.keys.join("+").toLowerCase();

      if (!seen.has(signature)) {
        seen.set(signature, binding.keys);
      }
    }
  }

  return Array.from(seen.values());
}

export function ShortcutDetail({ group }: { group: ShortcutGroup }) {
  const chords = uniqueChords(group);
  const appCount = group.entries.length;

  return (
    <article className="py-12 sm:py-16">
      <Link
        className="text-sm text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        href="/"
      >
        ← all shortcuts
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            {group.action}
          </h1>
          <p className="mt-2 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {group.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <AvatarGroup>
              {group.entries.map(({ company }) => (
                <Avatar key={company.id} title={company.name}>
                  <AvatarImage
                    alt={`${company.name} icon`}
                    src={getCompanyIconUrl(company)}
                  />
                  <AvatarFallback>{company.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              used by {appCount} app{appCount === 1 ? "" : "s"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        <KbdGroup>
          {chords.map((chord) => (
            <span
              className="inline-flex items-center gap-0.5 rounded-md bg-white shadow-sm dark:bg-zinc-900"
              key={chord.join("+")}
            >
              {chord.map((key) => (
                <Kbd className="border-0 shadow-none" key={key}>
                  {key}
                </Kbd>
              ))}
            </span>
          ))}
        </KbdGroup>
      </header>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Used by
        </h2>

        <ul className="mt-3 space-y-3">
          {group.entries.flatMap(({ company, shortcut }) =>
            shortcut.bindings.map((binding) => (
              <li key={`${company.id}-${shortcut.id}-${binding.context}`}>
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
                      <div className="flex flex-wrap justify-end gap-1">
                        {binding.keys.map((key) => (
                          <Kbd key={`${binding.context}-${key}`}>{key}</Kbd>
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
              </li>
            )),
          )}
        </ul>
      </section>
    </article>
  );
}
