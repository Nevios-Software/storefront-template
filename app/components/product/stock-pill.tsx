import type { ProductVariant } from "@nevios/storefront-js";

import { cn } from "~/lib/utils";

interface StockPillProps {
  variant: ProductVariant | null;
  /** Don't render anything when the variant is in stock (default false). */
  hideInStock?: boolean;
  className?: string;
}

const LABEL: Record<string, string> = {
  in_stock: "Skladem",
  preorder: "Předobjednávka",
  out_of_stock: "Vyprodáno",
};

const TONE: Record<string, string> = {
  in_stock: "bg-[color-mix(in_oklch,var(--success)_16%,transparent)] text-success-fg",
  preorder: "bg-paper-cream text-fg-2",
  out_of_stock: "bg-paper-cream text-fg-3",
};

/** Availability pill — reads variant.availability.status. */
export function StockPill({ variant, hideInStock = false, className }: StockPillProps) {
  const status = variant?.availability?.status;
  if (!status) return null;
  if (status === "in_stock" && hideInStock) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold",
        TONE[status],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {LABEL[status]}
    </span>
  );
}
