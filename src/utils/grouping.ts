import type { ShortcutEntry, ShortcutGroup } from "@/lib/types";
import { slugify } from "./slug";

export function groupHotkeys(hotkeys: ShortcutEntry[]): ShortcutGroup[] {
  const groups = new Map<string, ShortcutGroup>();

  for (const entry of hotkeys) {
    const id = slugify(entry.shortcut.action);

    let group = groups.get(id);

    if (!group) {
      group = {
        id,
        action: entry.shortcut.action,
        description: entry.shortcut.description,
        tags: [],
        entries: [],
      };
      groups.set(id, group);
    }

    group.entries.push(entry);

    for (const tag of entry.shortcut.tags) {
      if (!group.tags.includes(tag)) {
        group.tags.push(tag);
      }
    }
  }

  return Array.from(groups.values()).sort((first, second) =>
    first.action.localeCompare(second.action),
  );
}
