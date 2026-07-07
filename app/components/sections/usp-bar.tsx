import type { LucideIcon } from "lucide-react";

import { cn } from "~/lib/utils";

export interface UspItem {
  icon: LucideIcon;
  label: string;
  description?: string;
}

interface UspBarProps {
  items: UspItem[];
  className?: string;
}

/**
 * Trust-badge strip — free shipping, easy returns, secure payment, etc.
 * 2-up on mobile, up to 4-up on desktop. Pure props — no baked-in copy.
 */
export function UspBar({ items, className }: UspBarProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 rounded-2xl bg-paper-cream-soft p-4 text-center ring-1 ring-inset ring-[var(--hairline-soft)] sm:flex-row sm:gap-3 sm:text-left"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper-peach text-fg-1">
            <item.icon className="size-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg-1">{item.label}</p>
            {item.description && <p className="text-xs text-fg-3">{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
