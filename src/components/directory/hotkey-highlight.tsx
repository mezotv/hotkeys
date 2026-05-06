"use client";

import {
  type Hotkey,
  type RegisterableHotkey,
  useHotkeySequences,
  useHotkeys,
} from "@tanstack/react-hotkeys";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { HotkeyRegistration } from "@/utils/hotkey-registration";

type HotkeyState = "complete" | "partial" | null;

type HotkeyHighlightContextValue = {
  activeIds: string[];
  partialMatches: Record<string, number>;
};

const HotkeyHighlightContext = createContext<HotkeyHighlightContextValue>({
  activeIds: [],
  partialMatches: {},
});

export function HotkeyHighlightProvider({
  children,
  registrations,
}: {
  children: React.ReactNode;
  registrations: HotkeyRegistration[];
}) {
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [partialMatches, setPartialMatches] = useState<Record<string, number>>(
    {},
  );
  const sequenceProgressRef = useRef<Record<string, number>>({});

  const activate = useCallback((ids: string[]) => {
    setPartialMatches({});
    setActiveIds((current) => Array.from(new Set([...current, ...ids])));
    window.setTimeout(
      () =>
        setActiveIds((current) =>
          current.filter((currentId) => !ids.includes(currentId)),
        ),
      700,
    );
  }, []);

  const hotkeyDefinitions = useMemo(() => {
    const groups = new Map<
      string,
      { hotkey: RegisterableHotkey; ids: string[] }
    >();

    for (const registration of registrations) {
      if (registration.isSequence) {
        continue;
      }

      const signature = JSON.stringify(registration.hotkey);
      const group = groups.get(signature);

      if (group) {
        group.ids.push(registration.id);
      } else {
        groups.set(signature, {
          hotkey: registration.hotkey,
          ids: [registration.id],
        });
      }
    }

    return Array.from(groups.values()).map((group) => ({
      callback: (event: KeyboardEvent) => {
        event.preventDefault();
        activate(group.ids);
      },
      hotkey: group.hotkey,
      options: {
        meta: { name: `Highlight ${group.ids.join(", ")}` },
      },
    }));
  }, [activate, registrations]);

  const sequenceDefinitions = useMemo(() => {
    const groups = new Map<string, { ids: string[]; sequence: Hotkey[] }>();

    for (const registration of registrations) {
      if (!registration.isSequence) {
        continue;
      }

      const signature = registration.sequence.join("+");
      const group = groups.get(signature);

      if (group) {
        group.ids.push(registration.id);
      } else {
        groups.set(signature, {
          ids: [registration.id],
          sequence: registration.sequence,
        });
      }
    }

    return Array.from(groups.values()).map((group) => ({
      callback: (event: KeyboardEvent) => {
        event.preventDefault();
        activate(group.ids);
      },
      options: {
        meta: { name: `Highlight ${group.ids.join(", ")}` },
      },
      sequence: group.sequence,
    }));
  }, [activate, registrations]);

  useHotkeys(hotkeyDefinitions, {
    ignoreInputs: true,
    preventDefault: false,
    requireReset: true,
    stopPropagation: false,
  });
  useHotkeySequences(sequenceDefinitions, {
    ignoreInputs: true,
    preventDefault: false,
    stopPropagation: false,
    timeout: 1200,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInputLike(event.target)) {
        return;
      }

      const completedIds: string[] = [];
      const matches: Record<string, number> = {};
      const nextSequenceProgress: Record<string, number> = {};

      for (const registration of registrations) {
        if (matchesCompleteChord(registration.keys, event)) {
          completedIds.push(registration.id);
          continue;
        }

        if (registration.isSequence) {
          const currentIndex =
            sequenceProgressRef.current[registration.id] ?? 0;

          if (matchesDisplayKey(registration.keys[currentIndex], event)) {
            if (currentIndex === registration.keys.length - 1) {
              completedIds.push(registration.id);
            } else {
              matches[registration.id] = currentIndex;
              nextSequenceProgress[registration.id] = currentIndex + 1;
            }

            continue;
          }

          if (matchesDisplayKey(registration.keys[0], event)) {
            matches[registration.id] = 0;
            nextSequenceProgress[registration.id] = 1;
          }

          continue;
        }

        const matchingKeyIndex = registration.keys.findIndex((key) =>
          matchesDisplayKey(key, event),
        );

        if (matchingKeyIndex !== -1) {
          matches[registration.id] = matchingKeyIndex;
        }
      }

      sequenceProgressRef.current = nextSequenceProgress;

      if (completedIds.length > 0) {
        activate(completedIds);
      } else {
        setPartialMatches(matches);
      }
    };

    const handleKeyUp = () => setPartialMatches({});

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [activate, registrations]);

  return (
    <HotkeyHighlightContext.Provider value={{ activeIds, partialMatches }}>
      {children}
    </HotkeyHighlightContext.Provider>
  );
}

export function useHotkeyStates(id: string, keyCount: number): HotkeyState[] {
  const { activeIds, partialMatches } = useContext(HotkeyHighlightContext);

  return Array.from({ length: keyCount }, (_, keyIndex) => {
    if (activeIds.includes(id)) {
      return "complete";
    }

    return partialMatches[id] === keyIndex ? "partial" : null;
  });
}

function isInputLike(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'input:not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, select, [contenteditable="true"]',
    ),
  );
}

function matchesCompleteChord(keys: string[], event: KeyboardEvent) {
  const nonModifierKeys = keys.filter((key) => !isModifierDisplayKey(key));

  if (keys.length === 1) {
    return matchesDisplayKey(keys[0], event);
  }

  if (nonModifierKeys.length !== 1) {
    return false;
  }

  return (
    keys.every((key) =>
      isModifierDisplayKey(key) ? eventHasModifier(key, event) : true,
    ) && matchesDisplayKey(nonModifierKeys[0], event)
  );
}

function isModifierDisplayKey(key: string | undefined) {
  return ["⌘", "⌃", "Ctrl", "Control", "⌥", "Option", "⇧", "Shift"].includes(
    key ?? "",
  );
}

function eventHasModifier(displayKey: string, event: KeyboardEvent) {
  switch (displayKey) {
    case "⌘":
      return event.metaKey;
    case "⌃":
    case "Ctrl":
    case "Control":
      return event.ctrlKey;
    case "⌥":
    case "Option":
      return event.altKey;
    case "⇧":
    case "Shift":
      return event.shiftKey;
    default:
      return false;
  }
}

function matchesDisplayKey(
  displayKey: string | undefined,
  event: KeyboardEvent,
) {
  if (!displayKey) {
    return false;
  }

  switch (displayKey) {
    case "⌘":
      return event.key === "Meta";
    case "⌃":
    case "Ctrl":
    case "Control":
      return event.key === "Control";
    case "⌥":
    case "Option":
      return event.key === "Alt";
    case "⇧":
    case "Shift":
      return event.key === "Shift";
    case "Esc":
      return event.key === "Escape";
    default:
      return event.key.toLowerCase() === displayKey.toLowerCase();
  }
}
