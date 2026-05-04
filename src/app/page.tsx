import { DirectoryShell } from "@/components/directory";
import { loadDirectoryData } from "@/lib/data";

export default function Home() {
  const { companiesWithShortcuts, shortcuts, shortcutGroups } =
    loadDirectoryData();

  return (
    <DirectoryShell
      companies={companiesWithShortcuts}
      initialShortcutGroups={shortcutGroups}
      shortcutCount={shortcuts.length}
    />
  );
}
