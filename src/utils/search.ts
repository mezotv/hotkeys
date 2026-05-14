import type { Company, CompanyWithShortcuts, Shortcut } from "@/lib/types";

const ACTION_MATCH_SCORE = 40;
const COMPANY_MATCH_SCORE = 30;
const DESCRIPTION_MATCH_SCORE = 10;
const TAG_MATCH_SCORE = 8;
const BINDING_MATCH_SCORE = 4;

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

export function scoreShortcutQuery(
  shortcut: Shortcut,
  company: Company,
  query: string,
) {
  const lower = query.trim().toLowerCase();

  if (!lower) {
    return 0;
  }

  let score = 0;

  if (shortcut.action.toLowerCase().includes(lower)) {
    score += ACTION_MATCH_SCORE;
  }

  if (
    company.name.toLowerCase().includes(lower) ||
    company.category.toLowerCase().includes(lower)
  ) {
    score += COMPANY_MATCH_SCORE;
  }

  if (shortcut.description.toLowerCase().includes(lower)) {
    score += DESCRIPTION_MATCH_SCORE;
  }

  if (shortcut.tags.some((tag) => tag.toLowerCase().includes(lower))) {
    score += TAG_MATCH_SCORE;
  }

  if (
    shortcut.bindings.some((binding) =>
      [
        binding.context,
        binding.contextLabel,
        binding.note ?? "",
        ...binding.keys,
      ]
        .join(" ")
        .toLowerCase()
        .includes(lower),
    )
  ) {
    score += BINDING_MATCH_SCORE;
  }

  return score;
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
