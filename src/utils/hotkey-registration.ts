import type { Hotkey, RegisterableHotkey } from "@tanstack/react-hotkeys";
import type { ShortcutBinding } from "@/lib/types";

export type HotkeyRegistration =
  | {
      hotkey: RegisterableHotkey;
      id: string;
      isSequence: false;
      keys: string[];
    }
  | {
      id: string;
      isSequence: true;
      keys: string[];
      sequence: Hotkey[];
    };

const modifierKeys = new Set([
  "⌘",
  "⌃",
  "Ctrl",
  "Control",
  "Alt",
  "⌥",
  "Shift",
  "⇧",
]);

function toHotkeyToken(key: string) {
  switch (key) {
    case "⌘":
      return "Mod";
    case "⌃":
    case "Ctrl":
    case "Control":
      return "Control";
    case "⌥":
    case "Option":
      return "Alt";
    case "⇧":
    case "Shift":
      return "Shift";
    case "Esc":
      return "Escape";
    case "Space":
      return "Space";
    default:
      return key;
  }
}

function isModifiedChord(keys: string[]) {
  return keys.some((key) => modifierKeys.has(key));
}

export function bindingToRegistration(
  id: string,
  binding: ShortcutBinding,
): HotkeyRegistration {
  if (isModifiedChord(binding.keys)) {
    return {
      hotkey: binding.keys.map(toHotkeyToken).join("+") as Hotkey,
      id,
      isSequence: false,
      keys: binding.keys,
    };
  }

  const sequence = binding.keys.map(toHotkeyToken) as Hotkey[];

  if (sequence.length === 1) {
    return {
      hotkey: sequence[0],
      id,
      isSequence: false,
      keys: binding.keys,
    };
  }

  return {
    id,
    isSequence: true,
    keys: binding.keys,
    sequence,
  };
}
