import Link from "next/link";
import { HotkeyHighlightProvider } from "@/components/directory/hotkey-highlight";
import { ShortcutDetailEntry } from "@/components/directory/shortcut-detail-entry";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import type { ShortcutGroup } from "@/lib/types";
import { bindingToRegistration } from "@/utils/hotkey-registration";
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
  const registrations = group.entries.flatMap(({ company, shortcut }) =>
    shortcut.bindings.map((binding) =>
      bindingToRegistration(
        `${company.id}-${shortcut.id}-${binding.context}`,
        binding,
      ),
    ),
  );

  return (
    <article className="pt-6 pb-12 sm:pt-8 sm:pb-16">
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

        <KbdGroup className="ml-auto justify-end">
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

        <HotkeyHighlightProvider registrations={registrations}>
          <ul className="mt-3 space-y-3">
            {group.entries.flatMap(({ company, shortcut }) =>
              shortcut.bindings.map((binding) => {
                const highlightId = `${company.id}-${shortcut.id}-${binding.context}`;

                return (
                  <li key={highlightId}>
                    <ShortcutDetailEntry
                      binding={binding}
                      company={company}
                      highlightId={highlightId}
                    />
                  </li>
                );
              }),
            )}
          </ul>
        </HotkeyHighlightProvider>
      </section>
    </article>
  );
}
