import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import type * as React from "react";
import { cn } from "@/utils/cn";

export function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Root>) {
  return (
    <BaseAvatar.Root
      className={cn(
        "relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/[.08] bg-white text-[10px] font-medium text-zinc-600 dark:border-white/[.12] dark:bg-zinc-900 dark:text-zinc-300",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Image>) {
  return (
    <BaseAvatar.Image
      className={cn("size-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Fallback>) {
  return (
    <BaseAvatar.Fallback
      className={cn(
        "flex size-full items-center justify-center bg-zinc-100 dark:bg-zinc-800",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center -space-x-2 *:ring-2 *:ring-white dark:*:ring-zinc-950",
        className,
      )}
      {...props}
    />
  );
}
