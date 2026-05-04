import type { Company, CompanyWithShortcuts, Shortcut } from "@/lib/types";

export function shortcutMatchesQuery(
  shortcut: Shortcut,
  company: Company,
  query: string,
) {
  if (!query) {
    return true;
  }

  const haystack = [
    company.name,
    company.category,
    shortcut.action,
    shortcut.description,
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

  return haystack.includes(query.toLowerCase());
}

export function companyMatchesQuery(
  company: CompanyWithShortcuts,
  query: string,
): CompanyWithShortcuts | null {
  const trimmed = query.trim();

  if (!trimmed) {
    return company;
  }

  const lower = trimmed.toLowerCase();
  const companyHit =
    company.name.toLowerCase().includes(lower) ||
    company.category.toLowerCase().includes(lower);

  if (companyHit) {
    return company;
  }

  const matchingShortcuts = company.shortcuts.filter((shortcut) =>
    shortcutMatchesQuery(shortcut, company, trimmed),
  );

  if (matchingShortcuts.length === 0) {
    return null;
  }

  return { ...company, shortcuts: matchingShortcuts };
}
