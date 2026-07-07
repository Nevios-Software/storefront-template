import { useEffect, useState } from "react";
import type { Product, ProductVariant } from "@nevios/storefront-js";

import { cn } from "~/lib/utils";

function matchVariant(product: Product, selected: string[]): ProductVariant | null {
  return (
    product.variants.find(
      (v) => v.options.length === selected.length && v.options.every((o, i) => o === selected[i]),
    ) ?? null
  );
}

interface VariantSelectorProps {
  product: Product;
  onChange?: (variant: ProductVariant | null) => void;
  className?: string;
}

/**
 * One pill row per product option (Color, Size…) — resolves the matching
 * variant and reports it via onChange. Renders nothing for single-variant
 * products (no options to choose from).
 */
export function VariantSelector({ product, onChange, className }: VariantSelectorProps) {
  const [selected, setSelected] = useState<string[]>(() => product.variants[0]?.options ?? []);

  useEffect(() => {
    onChange?.(matchVariant(product, selected));
    // onChange excluded on purpose — callers needn't memoize it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selected]);

  if (product.options.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {product.options.map((opt, optIndex) => (
        <div key={opt.name} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-fg-1">{opt.name}</span>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((value) => {
              const isActive = selected[optIndex] === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    setSelected((prev) => {
                      const next = [...prev];
                      next[optIndex] = value;
                      return next;
                    })
                  }
                  className={cn(
                    "rounded-pill px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand text-white"
                      : "bg-paper-cream-soft text-fg-1 ring-1 ring-inset ring-[var(--hairline)] hover:bg-paper-cream",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
