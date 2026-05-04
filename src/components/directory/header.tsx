import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AUTHOR_URL, GITHUB_REPO_URL } from "@/lib/constants";
import type { ViewMode } from "@/lib/types";
import { AddShortcutButton } from "./add-shortcut-button";

const viewOptions: { label: string; value: ViewMode }[] = [
  { label: "shortcuts", value: "shortcuts" },
  { label: "companies", value: "companies" },
];

export function Header({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-8 sm:px-8">
      <div className="flex flex-col leading-none sm:flex-row sm:items-baseline sm:gap-1.5">
        <a
          className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          href="/"
        >
          hotkeys
        </a>
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
        <ToggleGroup
          aria-label="View mode"
          onValueChange={(value) => {
            const next = value[0];

            if (next === "shortcuts" || next === "companies") {
              onViewModeChange(next);
            }
          }}
          value={[viewMode]}
        >
          {viewOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button
          className="hidden sm:inline-flex"
          nativeButton={false}
          render={
            <a href={GITHUB_REPO_URL} rel="noreferrer" target="_blank">
              GitHub
            </a>
          }
          variant="outline"
        />
        <AddShortcutButton />
      </nav>
    </header>
  );
}
