"use client";

import { type RegisterableHotkey, useHotkeys } from "@tanstack/react-hotkeys";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { EDIT_SHORTCUTS_URL } from "@/lib/constants";

export function AddShortcutButton() {
  const addShortcutHotkey = useMemo(
    () => [
      {
        callback: (event: KeyboardEvent) => {
          event.preventDefault();
          window.open(EDIT_SHORTCUTS_URL, "_blank", "noopener,noreferrer");
        },
        hotkey: "S" as RegisterableHotkey,
        options: {
          meta: { name: "Add shortcut" },
        },
      },
    ],
    [],
  );

  useHotkeys(addShortcutHotkey, {
    ignoreInputs: true,
    preventDefault: false,
    requireReset: true,
    stopPropagation: false,
  });

  return (
    <Button
      className="gap-2 pr-2"
      nativeButton={false}
      render={
        <a
          aria-keyshortcuts="S"
          href={EDIT_SHORTCUTS_URL}
          rel="noreferrer"
          target="_blank"
        >
          <span>Add shortcut</span>
          <Kbd className="min-w-5 px-1 py-0 text-[10px] leading-4">S</Kbd>
        </a>
      }
      size="sm"
    />
  );
}
