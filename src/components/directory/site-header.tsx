import Link from "next/link";
import { AUTHOR_URL } from "@/lib/constants";
import { AddShortcutButton } from "./add-shortcut-button";
import { GitHubButton } from "./github-button";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-8 sm:px-8">
      <div className="flex flex-col leading-none sm:flex-row sm:items-baseline sm:gap-1.5">
        <Link
          className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          href="/"
        >
          hotkeys
        </Link>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          by{" "}
          <a
            className="text-zinc-700 underline decoration-black/20 transition hover:text-zinc-950 hover:decoration-black dark:text-zinc-300 dark:decoration-white/25 dark:hover:text-zinc-50 dark:hover:decoration-white"
            href={AUTHOR_URL}
            rel="noreferrer"
            target="_blank"
          >
            dominik
          </a>
        </span>
      </div>

      <nav className="flex items-center gap-2">
        <GitHubButton />
        <AddShortcutButton />
      </nav>
    </header>
  );
}
