import Image from "next/image";
import Link from "next/link";
import { CompanyDetailShortcut } from "@/components/directory/company-detail-shortcut";
import { HotkeyHighlightProvider } from "@/components/directory/hotkey-highlight";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_URL } from "@/lib/constants";
import type { CompanyWithShortcuts } from "@/lib/types";
import { bindingToRegistration } from "@/utils/hotkey-registration";
import { getCompanyIconUrl } from "@/utils/icons";

export function CompanyDetail({ company }: { company: CompanyWithShortcuts }) {
  const registrations = company.shortcuts.flatMap((shortcut) =>
    shortcut.bindings.map((binding) =>
      bindingToRegistration(`${shortcut.id}-${binding.context}`, binding),
    ),
  );

  return (
    <article className="pt-6 pb-12 sm:pt-8 sm:pb-16">
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
              href={`${SITE_URL}/?ref=${encodeURIComponent(company.website)}`}
              rel="noreferrer"
              target="_blank"
            >
              {new URL(company.website).hostname.replace(/^www\./, "")}
            </a>
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {company.description}
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
          <HotkeyHighlightProvider registrations={registrations}>
            <ul className="mt-3 space-y-3">
              {company.shortcuts.map((shortcut) => (
                <li key={shortcut.id}>
                  <CompanyDetailShortcut shortcut={shortcut} />
                </li>
              ))}
            </ul>
          </HotkeyHighlightProvider>
        )}
      </section>
    </article>
  );
}
