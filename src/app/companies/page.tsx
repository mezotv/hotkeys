import { DirectoryShell } from "@/components/directory";
import { loadDirectoryData } from "@/lib/data";

export default function CompaniesPage() {
  const { companiesWithShortcuts, shortcuts, shortcutGroups } =
    loadDirectoryData();

  return (
    <DirectoryShell
      companies={companiesWithShortcuts}
      initialShortcutGroups={shortcutGroups}
      initialViewMode="companies"
      shortcutCount={shortcuts.length}
    />
  );
}
