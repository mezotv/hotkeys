"use client";

import Link from "next/link";
import { CompanyDetailBinding } from "@/components/directory/company-detail-binding";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Shortcut } from "@/lib/types";

export function CompanyDetailShortcut({ shortcut }: { shortcut: Shortcut }) {
  return (
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
          {shortcut.bindings.map((binding) => {
            const highlightId = `${shortcut.id}-${binding.context}`;

            return (
              <CompanyDetailBinding
                binding={binding}
                highlightId={highlightId}
                key={highlightId}
              />
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
