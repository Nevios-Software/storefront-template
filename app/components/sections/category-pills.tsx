import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export interface CategoryPill {
  href: string;
  label: string;
  icon: LucideIcon;
}

export type CategoryPillsSize = "md" | "lg";

interface CategoryPillsProps {
  pills: CategoryPill[];
  size?: CategoryPillsSize;
  className?: string;
}

/**
 * Quick-link pill row — cream/peach pills with icon + label + coral arrow CTA.
 * Ported verbatim from the Bodybe Next store; only framework seams changed.
 */
export function CategoryPills({ pills, size = "lg", className }: CategoryPillsProps) {
  const isLg = size === "lg";

  return (
    <nav aria-label="Rychlé odkazy" className={cn(className)}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pills.map((pill) => (
          <li key={pill.href}>
            <Link
              to={pill.href}
              className={cn(
                "group bg-paper-cream-soft hover:bg-paper-cream",
                "flex items-center justify-between rounded-pill",
                "transition-colors",
                isLg
                  ? "gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-4"
                  : "gap-2 px-3 py-2 sm:gap-3 sm:px-5 sm:py-3",
              )}
            >
              <span className="flex min-w-0 items-center gap-2 sm:gap-3">
                <pill.icon
                  className={cn(
                    "text-coral shrink-0",
                    isLg ? "size-4 sm:size-6" : "size-4 sm:size-5",
                  )}
                />
                <span
                  className={cn(
                    "text-fg-1 truncate font-semibold",
                    isLg ? "text-xs sm:text-base" : "text-xs sm:text-sm",
                  )}
                >
                  {pill.label}
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "bg-coral group-hover:bg-[var(--brand-hover)]",
                  "flex shrink-0 items-center justify-center rounded-full transition-colors",
                  isLg ? "size-7 sm:size-10" : "size-6 sm:size-8",
                )}
              >
                <ArrowRight
                  className={cn(
                    "text-white",
                    isLg ? "size-3.5 sm:size-5" : "size-3 sm:size-4",
                  )}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
