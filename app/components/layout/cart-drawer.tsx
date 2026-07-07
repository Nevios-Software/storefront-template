import { Link } from "react-router";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, formatCents } from "@nevios/storefront-kit";

import { useMarketData } from "~/lib/market";
import { MediaImage } from "~/components/shared/media-image";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

/**
 * Cart drawer — slides in from the right (Sheet animation). Reads the shared
 * kit cart state (same as the header count + PDP add-to-cart). Totals re-key
 * with `.num-roll`, so amounts slide in on every change.
 */
export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cart, loading, updateLine, removeLine } = useCart();
  const { locale } = useMarketData();
  const lines = cart?.line_items ?? [];
  const totals = cart?.totals;
  const currency = cart?.currency ?? "CZK";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full border-l-0 bg-card sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between pb-2">
          <SheetTitle className="text-lg font-bold text-fg-1">Košík</SheetTitle>
          {loading && <Loader2 className="mr-8 size-4 animate-spin text-fg-3" />}
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span
              aria-hidden
              className="flex size-14 items-center justify-center rounded-full bg-paper-cream text-fg-3"
            >
              <ShoppingBag className="size-6" />
            </span>
            <p className="font-semibold text-fg-1">Košík je prázdný</p>
            <Link
              to="/collections"
              onClick={onClose}
              className="rounded-pill bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Prozkoumat kolekce
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-4">
              {lines.map((line, i) => (
                <li
                  key={line.id}
                  className={i > 0 ? "border-t border-[var(--hairline-soft)]" : undefined}
                >
                  <div className="flex gap-3 py-4">
                    {/* No PDP link — CartLine carries ids, not the handle the route needs. */}
                    <span className="block size-16 shrink-0 overflow-hidden rounded-xl bg-paper-cream">
                      <MediaImage
                        src={line.image_url}
                        alt=""
                        width={128}
                        className="h-full w-full object-contain p-1.5"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg-1">{line.title}</p>
                      {line.variant_title && (
                        <p className="truncate text-xs text-fg-3">{line.variant_title}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        {/* Qty stepper */}
                        <span className="inline-flex items-center gap-1 rounded-pill bg-paper-cream-soft p-0.5 ring-1 ring-inset ring-[var(--hairline-soft)]">
                          <button
                            type="button"
                            aria-label="Snížit množství"
                            disabled={loading || line.quantity <= 1}
                            onClick={() => updateLine(line.id, line.quantity - 1)}
                            className="flex size-7 items-center justify-center rounded-full text-fg-2 transition-colors hover:bg-card disabled:opacity-40"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span key={line.quantity} className="num num-roll w-5 text-center text-sm font-semibold text-fg-1">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Zvýšit množství"
                            disabled={loading}
                            onClick={() => updateLine(line.id, line.quantity + 1)}
                            className="flex size-7 items-center justify-center rounded-full text-fg-2 transition-colors hover:bg-card disabled:opacity-40"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </span>
                        <span
                          key={line.line_total_cents}
                          className="num num-roll text-sm font-bold text-fg-1"
                        >
                          {formatCents(line.line_total_cents, currency, locale)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Odebrat z košíku"
                      disabled={loading}
                      onClick={() => removeLine(line.id)}
                      className="self-start rounded-full p-1.5 text-fg-4 transition-colors hover:bg-paper-cream-soft hover:text-fg-2 disabled:opacity-40"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-[var(--hairline)] bg-paper-cream-soft px-4 py-4">
              {totals && (
                <>
                  <div className="flex items-center justify-between text-sm text-fg-2">
                    <span>Mezisoučet</span>
                    <span key={totals.subtotal_with_tax_cents} className="num num-roll">
                      {formatCents(totals.subtotal_with_tax_cents, currency, locale)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-base font-bold text-fg-1">
                    <span>Celkem</span>
                    <span key={totals.total_cents} className="num num-roll">
                      {formatCents(totals.total_cents, currency, locale)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-fg-3">Doprava se spočítá v pokladně.</p>
                </>
              )}
              <Button asChild size="lg" className="mt-3 w-full">
                <Link to="/checkout" onClick={onClose}>
                  K pokladně
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
