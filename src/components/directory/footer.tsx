import { AUTHOR_URL, GITHUB_REPO_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 py-12 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p>
        hotkeys by{" "}
        <a
          className="font-medium text-zinc-950 underline decoration-black/20 transition hover:decoration-black dark:text-zinc-50 dark:decoration-white/25 dark:hover:decoration-white"
          href={AUTHOR_URL}
          rel="noreferrer"
          target="_blank"
        >
          dominik
        </a>
      </p>
      <a
        className="font-medium text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
        href={GITHUB_REPO_URL}
        rel="noreferrer"
        target="_blank"
      >
        source on github
      </a>
    </footer>
  );
}
