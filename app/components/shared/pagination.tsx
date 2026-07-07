import { Link, useLocation } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "~/lib/utils";

interface PaginationProps {
  /** Total item count (from the SDK list response). */
  total: number;
  /** Items per page. */
  pageSize: number;
  /** Current 1-based page. */
  page: number;
  className?: string;
}

/** Which page numbers to show: 1 … around-current … last. */
function pageWindow(page: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const around = [page - 1, page, page + 1].filter((p) => p > 1 && p < pages);
  const out: (number | "…")[] = [1];
  if (around[0] !== undefined && around[0] > 2) out.push("…");
  out.push(...around);
  if (around.at(-1) !== undefined && around.at(-1)! < pages - 1) out.push("…");
  out.push(pages);
  return out;
}

/**
 * URL-driven pagination — links carry `?page=N` on the current path, so pages
 * are SSR'd, shareable, and back-button friendly (no client state).
 */
export function Pagination({ total, pageSize, page, className }: PaginationProps) {
  const { pathname, search } = useLocation();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams(search);
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav aria-label="Stránkování" className={cn("flex items-center justify-center gap-1", className)}>
      {page > 1 && (
        <Link
          to={hrefFor(page - 1)}
          aria-label="Předchozí stránka"
          className="inline-flex size-9 items-center justify-center rounded-pill text-fg-2 transition-colors hover:bg-paper-cream"
        >
          <ChevronLeft className="size-4" />
        </Link>
      )}
      {pageWindow(page, pages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-fg-4">
            …
          </span>
        ) : (
          <Link
            key={p}
            to={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "num inline-flex size-9 items-center justify-center rounded-pill text-sm font-medium transition-colors",
              p === page ? "bg-brand text-white" : "text-fg-2 hover:bg-paper-cream",
            )}
          >
            {p}
          </Link>
        ),
      )}
      {page < pages && (
        <Link
          to={hrefFor(page + 1)}
          aria-label="Další stránka"
          className="inline-flex size-9 items-center justify-center rounded-pill text-fg-2 transition-colors hover:bg-paper-cream"
        >
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}
