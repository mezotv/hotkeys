import type { Company, Shortcut } from "./types";

const slugPattern = /^[a-z][a-zA-Z0-9]*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
}

function assertStringArray(
  value: unknown,
  field: string,
): asserts value is string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== "string" || item.length === 0)
  ) {
    throw new Error(`${field} must be a non-empty array of strings`);
  }
}

function assertUniqueIds(items: { id: string }[], label: string) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate ${label} id: ${item.id}`);
    }

    seen.add(item.id);
  }
}

export function assertCompanies(value: unknown): asserts value is Company[] {
  if (!Array.isArray(value)) {
    throw new Error("companies.json must be an array");
  }

  for (const [index, company] of value.entries()) {
    if (!isRecord(company)) {
      throw new Error(`companies[${index}] must be an object`);
    }

    assertString(company.id, `companies[${index}].id`);
    assertString(company.name, `companies[${index}].name`);
    assertString(company.slug, `companies[${index}].slug`);
    assertString(company.website, `companies[${index}].website`);
    assertString(company.category, `companies[${index}].category`);

    if (!slugPattern.test(company.slug)) {
      throw new Error(`companies[${index}].slug must be a slug`);
    }
  }

  assertUniqueIds(value, "company");
}

export function assertShortcuts(value: unknown): asserts value is Shortcut[] {
  if (!Array.isArray(value)) {
    throw new Error("shortcuts.json must be an array");
  }

  for (const [shortcutIndex, shortcut] of value.entries()) {
    if (!isRecord(shortcut)) {
      throw new Error(`shortcuts[${shortcutIndex}] must be an object`);
    }

    assertString(shortcut.id, `shortcuts[${shortcutIndex}].id`);
    assertString(shortcut.companyId, `shortcuts[${shortcutIndex}].companyId`);
    assertString(shortcut.action, `shortcuts[${shortcutIndex}].action`);
    assertString(
      shortcut.description,
      `shortcuts[${shortcutIndex}].description`,
    );
    assertStringArray(shortcut.tags, `shortcuts[${shortcutIndex}].tags`);

    if (!Array.isArray(shortcut.bindings) || shortcut.bindings.length === 0) {
      throw new Error(
        `shortcuts[${shortcutIndex}].bindings must have at least one binding`,
      );
    }

    for (const [bindingIndex, binding] of shortcut.bindings.entries()) {
      if (!isRecord(binding)) {
        throw new Error(
          `shortcuts[${shortcutIndex}].bindings[${bindingIndex}] must be an object`,
        );
      }

      assertString(
        binding.context,
        `shortcuts[${shortcutIndex}].bindings[${bindingIndex}].context`,
      );
      assertString(
        binding.contextLabel,
        `shortcuts[${shortcutIndex}].bindings[${bindingIndex}].contextLabel`,
      );

      if (!slugPattern.test(binding.context)) {
        throw new Error(
          `shortcuts[${shortcutIndex}].bindings[${bindingIndex}].context must be a slug`,
        );
      }

      assertStringArray(
        binding.keys,
        `shortcuts[${shortcutIndex}].bindings[${bindingIndex}].keys`,
      );

      if (binding.note !== undefined) {
        assertString(
          binding.note,
          `shortcuts[${shortcutIndex}].bindings[${bindingIndex}].note`,
        );
      }
    }
  }

  assertUniqueIds(value, "shortcut");
}

export function validateDirectoryData(companies: unknown, shortcuts: unknown) {
  assertCompanies(companies);
  assertShortcuts(shortcuts);

  const companyIds = new Set(companies.map((company) => company.id));

  for (const shortcut of shortcuts) {
    if (!companyIds.has(shortcut.companyId)) {
      throw new Error(
        `Shortcut "${shortcut.id}" references missing company "${shortcut.companyId}"`,
      );
    }
  }
}
