import { groupHotkeys } from "@/utils/grouping";
import companiesJson from "../../companies.json";
import shortcutsJson from "../../shortcuts.json";
import type { CompanyWithShortcuts, Shortcut, ShortcutGroup } from "./types";
import { validateDirectoryData } from "./validation";

export function filterShortcuts(
  shortcuts: Shortcut[],
  searchParams: URLSearchParams,
) {
  const company = searchParams.get("company")?.toLowerCase();
  const context = searchParams.get("context")?.toLowerCase();
  const tag = searchParams.get("tag")?.toLowerCase();
  const query = searchParams.get("q")?.trim().toLowerCase();

  return shortcuts.filter((shortcut) => {
    if (company && shortcut.companyId.toLowerCase() !== company) {
      return false;
    }

    if (
      context &&
      !shortcut.bindings.some(
        (binding) =>
          binding.context.toLowerCase() === context ||
          binding.contextLabel.toLowerCase().includes(context),
      )
    ) {
      return false;
    }

    if (
      tag &&
      !shortcut.tags.some((shortcutTag) => shortcutTag.toLowerCase() === tag)
    ) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      shortcut.action,
      shortcut.description,
      shortcut.companyId,
      ...shortcut.tags,
      ...shortcut.bindings.flatMap((binding) => [
        binding.context,
        binding.contextLabel,
        binding.note ?? "",
        ...binding.keys,
      ]),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function loadDirectoryData() {
  validateDirectoryData(companiesJson, shortcutsJson);

  const companies = [...companiesJson].sort((first, second) =>
    first.name.localeCompare(second.name),
  );

  const shortcuts = [...shortcutsJson].sort((first, second) =>
    first.action.localeCompare(second.action),
  );

  const companiesWithShortcuts: CompanyWithShortcuts[] = companies
    .map((company) => ({
      ...company,
      shortcuts: shortcuts.filter(
        (shortcut) => shortcut.companyId === company.id,
      ),
    }))
    .filter((company) => company.shortcuts.length > 0);

  const hotkeys = companiesWithShortcuts.flatMap((company) =>
    company.shortcuts.map((shortcut) => ({ company, shortcut })),
  );

  const shortcutGroups = groupHotkeys(hotkeys);

  return {
    companies,
    shortcuts,
    companiesWithShortcuts,
    shortcutGroups,
  };
}

export function findCompanyBySlug(slug: string): CompanyWithShortcuts | null {
  const { companies, shortcuts } = loadDirectoryData();
  const company = companies.find((entry) => entry.slug === slug);

  if (!company) {
    return null;
  }

  return {
    ...company,
    shortcuts: shortcuts.filter(
      (shortcut) => shortcut.companyId === company.id,
    ),
  };
}

export function findShortcutGroupBySlug(slug: string): ShortcutGroup | null {
  const { shortcutGroups } = loadDirectoryData();

  return shortcutGroups.find((group) => group.id === slug) ?? null;
}
