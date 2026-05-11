"use client";

import { type RegisterableHotkey, useHotkeys } from "@tanstack/react-hotkeys";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { GITHUB_REPO_URL } from "@/lib/constants";

export function GitHubButton() {
  const githubHotkey = useMemo(
    () => [
      {
        callback: (event: KeyboardEvent) => {
          event.preventDefault();
          window.open(GITHUB_REPO_URL, "_blank", "noopener,noreferrer");
        },
        hotkey: "G" as RegisterableHotkey,
        options: {
          meta: { name: "Open GitHub" },
        },
      },
    ],
    [],
  );

  useHotkeys(githubHotkey, {
    ignoreInputs: true,
    preventDefault: false,
    requireReset: true,
    stopPropagation: false,
  });

  return (
    <Button
      className="hidden gap-2 pr-2 sm:inline-flex"
      nativeButton={false}
      render={
        <a
          aria-keyshortcuts="G"
          href={GITHUB_REPO_URL}
          rel="noreferrer"
          target="_blank"
        >
          <span>GitHub</span>
          <Kbd className="min-w-5 px-1 py-0 text-[10px] leading-4">G</Kbd>
        </a>
      }
      variant="outline"
    />
  );
}
