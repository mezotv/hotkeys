import type { ShortcutEntry, ShortcutGroup } from "@/lib/types";
import { scoreShortcutQuery } from "@/utils/search";

export function groupHotkeys(
  hotkeys: ShortcutEntry[],
  options: { query?: string } = {},
): ShortcutGroup[] {
  const groups = new Map<string, ShortcutGroup>();

  for (const entry of hotkeys) {
    const id = entry.shortcut.id;

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

  const shortcutGroups = Array.from(groups.values());
  const query = options.query?.trim();

  if (!query) {
    return shortcutGroups.sort((first, second) =>
      first.action.localeCompare(second.action),
    );
  }

  return shortcutGroups.sort((first, second) => {
    const firstScore = getGroupSearchScore(first, query);
    const secondScore = getGroupSearchScore(second, query);

    if (firstScore !== secondScore) {
      return secondScore - firstScore;
    }

    return first.action.localeCompare(second.action);
  });
}

function getGroupSearchScore(group: ShortcutGroup, query: string) {
  return Math.max(
    ...group.entries.map((entry) =>
      scoreShortcutQuery(entry.shortcut, entry.company, query),
    ),
  );
}
