import { Input } from "@/components/ui/input";

export function SearchBar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <label className="relative block" htmlFor="shortcut-search">
      <span className="sr-only">Search shortcuts</span>
      <Input
        id="shortcut-search"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search app, shortcut, key, context..."
        type="search"
        value={query}
      />
    </label>
  );
}
