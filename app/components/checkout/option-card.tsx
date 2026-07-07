import * as React from "react";

import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

/**
 * A selectable row card (radio semantics) shared by the shipping and payment
 * steps: ring highlight + subtle scale on the selected row, radio dot on the
 * left, free-form content + trailing slot. Wrap a list in role="radiogroup".
 */
export function OptionCard({
  selected,
  onSelect,
  disabled,
  children,
  trailing,
}: {
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-xl bg-card px-4 py-3.5 text-left outline-none",
        "transition-[box-shadow,transform,opacity] duration-base ease-spring-soft motion-reduce:transition-none motion-reduce:transform-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        "disabled:pointer-events-none disabled:opacity-60",
        selected
          ? "ring-2 ring-inset ring-brand motion-safe:scale-[1.01] shadow-[0_4px_14px_-6px_rgba(64,59,53,0.16)]"
          : "ring-1 ring-inset ring-[var(--hairline)] hover:ring-[var(--hairline-strong)]",
      )}
    >
      {/* Radio dot */}
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-base",
          selected ? "bg-brand" : "bg-card ring-1 ring-inset ring-[var(--hairline-strong)]",
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full bg-white transition-transform duration-base ease-spring motion-reduce:transition-none",
            selected ? "scale-100" : "scale-0",
          )}
        />
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {trailing ? <span className="shrink-0 text-right">{trailing}</span> : null}
    </button>
  );
}

/** Loading placeholder matching the OptionCard footprint. */
export function OptionCardSkeleton() {
  return (
    <div className="flex w-full items-center gap-3.5 rounded-xl bg-card px-4 py-3.5 ring-1 ring-inset ring-[var(--hairline)]">
      <Skeleton className="size-5 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}
