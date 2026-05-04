import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ViewMode } from "@/lib/types";

const viewOptions: { label: string; value: ViewMode }[] = [
  { label: "shortcuts", value: "shortcuts" },
  { label: "companies", value: "companies" },
];

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  return (
    <ToggleGroup
      aria-label="View mode"
      onValueChange={(value) => {
        const next = value[0];

        if (next === "shortcuts" || next === "companies") {
          onViewModeChange(next);
        }
      }}
      value={[viewMode]}
    >
      {viewOptions.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
