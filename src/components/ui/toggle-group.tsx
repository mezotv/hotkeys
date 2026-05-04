import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import type * as React from "react";
import { cn } from "@/utils/cn";

export function ToggleGroup<Value extends string>({
  className,
  ...props
}: BaseToggleGroup.Props<Value>) {
  return (
    <BaseToggleGroup
      className={cn(
        "inline-flex h-9 items-center rounded-lg border border-black/[.08] bg-zinc-100 p-1 text-zinc-500 shadow-sm dark:border-white/[.10] dark:bg-zinc-900 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

type ToggleGroupItemProps<Value extends string> = Toggle.Props<Value> &
  React.RefAttributes<HTMLButtonElement>;

export function ToggleGroupItem<Value extends string>({
  className,
  ...props
}: ToggleGroupItemProps<Value>) {
  return (
    <Toggle
      className={cn(
        "inline-flex h-7 items-center justify-center rounded-md px-3 text-xs font-medium outline-none transition hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-black/[.08] data-[pressed]:bg-white data-[pressed]:text-zinc-950 data-[pressed]:shadow-sm dark:hover:text-zinc-50 dark:focus-visible:ring-white/[.12] dark:data-[pressed]:bg-zinc-950 dark:data-[pressed]:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}
