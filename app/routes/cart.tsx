import { useCart, useT, CartLineItem, CartSummary } from "@nevios/storefront-kit";

import type { Route } from "./+types/cart";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Cart · ${shop.name}` }];
}

// Cart is per-session + interactive — never cached, rendered client-side.
export default function CartRoute() {
  const t = useT();
  const { locale } = useMarketData();
  const { cart, loading } = useCart();
  const lines = cart?.line_items ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 500 }}>{t("cart.title")}</h1>

      {lines.length === 0 ? (
        <p style={{ color: "var(--nv-muted)" }}>
          {loading ? t("common.loadingShort") : t("cart.empty")}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "2.5rem",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 20rem)",
            alignItems: "start",
          }}
        >
          <div>
            {lines.map((line, i) => (
              <div
                key={line.id}
                style={i > 0 ? { borderTop: "1px solid var(--nv-border)" } : undefined}
              >
                <CartLineItem line={line} locale={locale} />
              </div>
            ))}
          </div>
          <aside
            style={{
              position: "sticky",
              top: "1.5rem",
              padding: "1.25rem",
              border: "1px solid var(--nv-border)",
              borderRadius: "var(--nv-radius)",
            }}
          >
            <CartSummary checkoutHref="/checkout" locale={locale} />
          </aside>
        </div>
      )}
    </div>
  );
}
