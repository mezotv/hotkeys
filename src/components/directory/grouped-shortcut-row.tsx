"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd, KbdChord, KbdGroup } from "@/components/ui/kbd";
import type { ShortcutGroup } from "@/lib/types";
import { getCompanyIconUrl } from "@/utils/icons";

function Chord({ keys }: { keys: string[] }) {
  return <KbdChord keys={keys} />;
}

export function GroupedShortcutRow({ group }: { group: ShortcutGroup }) {
  const [expanded, setExpanded] = useState(false);
  const appCount = group.entries.length;

  const uniqueChords = useMemo(() => {
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
  }, [group]);

  return (
    <Card className="transition hover:border-black/[.12] dark:hover:border-white/[.16]">
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link
              className="block outline-none focus-visible:ring-2 focus-visible:ring-black/[.08] dark:focus-visible:ring-white/[.12]"
              href={`/shortcuts/${group.id}`}
            >
              <h3 className="text-base font-semibold tracking-tight text-zinc-950 transition hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300">
                {group.action}
              </h3>
            </Link>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {group.description}
            </p>

            <button
              aria-expanded={expanded}
              className="mt-4 flex w-full flex-wrap items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-black/[.08] dark:focus-visible:ring-white/[.12]"
              onClick={() => setExpanded((value) => !value)}
              type="button"
            >
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
                used by {appCount} app{appCount === 1 ? "" : "s"} ·{" "}
                {expanded ? "hide" : "show"} contexts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </button>
          </div>

          <KbdGroup className="ml-auto justify-end">
            {uniqueChords.map((chord) => (
              <Chord key={chord.join("+")} keys={chord} />
            ))}
          </KbdGroup>
        </div>

        {expanded ? (
          <ul className="mt-5 space-y-2 border-t border-black/[.06] pt-4 dark:border-white/[.06]">
            {group.entries.flatMap(({ company, shortcut }) =>
              shortcut.bindings.map((binding) => (
                <li
                  className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-black"
                  key={`${company.id}-${shortcut.id}-${binding.context}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <Image
                        alt=""
                        aria-hidden="true"
                        className="shrink-0 rounded-sm"
                        height={16}
                        src={getCompanyIconUrl(company)}
                        unoptimized
                        width={16}
                      />
                      <Link
                        className="truncate text-sm font-medium text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
                        href={`/companies/${company.slug}`}
                      >
                        {company.name}
                      </Link>
                      <span
                        aria-hidden="true"
                        className="text-xs text-zinc-500 dark:text-zinc-400"
                      >
                        /
                      </span>
                      <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {binding.contextLabel}
                      </span>
                    </div>
                    <div className="ml-auto flex min-w-0 shrink-0 flex-wrap justify-end gap-1">
                      {binding.keys.map((key) => (
                        <Kbd key={`${binding.context}-${key}`}>{key}</Kbd>
                      ))}
                    </div>
                  </div>
                  {binding.note ? (
                    <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                      {binding.note}
                    </p>
                  ) : null}
                </li>
              )),
            )}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
