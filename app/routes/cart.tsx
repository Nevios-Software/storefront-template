import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { useCart, useT, CartLineItem, CartSummary } from "@nevios/storefront-kit";

import type { Route } from "./+types/cart";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Košík · ${shop.name}` }];
}

// Cart is per-session + interactive — never cached, rendered client-side.
// Line items + totals come from the kit (shared CartProvider state); this
// route owns only the page shell around them.
export default function CartRoute() {
  const t = useT();
  const { locale } = useMarketData();
  const { cart, loading } = useCart();
  const lines = cart?.line_items ?? [];

  return (
    <div className="section-bb py-8 lg:py-12">
      <h1 className="mb-6 text-3xl font-bold text-fg-1 sm:text-4xl">{t("cart.title")}</h1>

      {lines.length === 0 ? (
        <div className="rounded-2xl bg-paper-cream-soft px-6 py-16 text-center">
          <span
            aria-hidden
            className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-paper-peach text-fg-2"
          >
            <ShoppingBag className="size-6" />
          </span>
          <p className="font-semibold text-fg-1">
            {loading ? t("common.loadingShort") : t("cart.empty")}
          </p>
          {!loading && (
            <Link
              to="/collections"
              className="mt-5 inline-flex rounded-pill bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Prozkoumat kolekce
            </Link>
          )}
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div className="rounded-2xl bg-card px-5 ring-1 ring-inset ring-[var(--hairline)]">
            {lines.map((line, i) => (
              <div key={line.id} className={i > 0 ? "border-t border-[var(--hairline-soft)]" : undefined}>
                <CartLineItem line={line} locale={locale} />
              </div>
            ))}
          </div>
          <aside className="rounded-2xl bg-paper-cream-soft p-5 ring-1 ring-inset ring-[var(--hairline-soft)] lg:sticky lg:top-24">
            <CartSummary checkoutHref="/checkout" locale={locale} />
          </aside>
        </div>
      )}
    </div>
  );
}
