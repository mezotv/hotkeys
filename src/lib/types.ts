export type Company = {
  id: string;
  name: string;
  slug: string;
  website: string;
  description: string;
  category: string;
};

export type ShortcutBinding = {
  context: string;
  contextLabel: string;
  keys: string[];
  note?: string;
};

export type Shortcut = {
  id: string;
  companyId: string;
  action: string;
  description: string;
  tags: string[];
  bindings: ShortcutBinding[];
};

export type CompanyWithShortcuts = Company & {
  shortcuts: Shortcut[];
};

export type ShortcutEntry = {
  company: Company;
  shortcut: Shortcut;
};

export type ShortcutGroup = {
  id: string;
  action: string;
  description: string;
  tags: string[];
  entries: ShortcutEntry[];
};

export type ViewMode = "shortcuts" | "companies";
