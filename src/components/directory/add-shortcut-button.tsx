import { Button } from "@/components/ui/button";
import { EDIT_SHORTCUTS_URL } from "@/lib/constants";

export function AddShortcutButton() {
  return (
    <Button
      nativeButton={false}
      render={
        <a href={EDIT_SHORTCUTS_URL} rel="noreferrer" target="_blank">
          Add shortcut
        </a>
      }
    />
  );
}
