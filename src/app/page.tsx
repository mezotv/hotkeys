import { DirectoryShell } from "@/components/directory";
import { loadDirectoryData } from "@/lib/data";

export default function Home() {
  const { companiesWithShortcuts, shortcuts } = loadDirectoryData();

  return (
    <DirectoryShell
      companies={companiesWithShortcuts}
      shortcutCount={shortcuts.length}
    />
  );
}
