import * as React from "react";
import { Link, useLocation } from "react-router";
import { ShoppingBag, User } from "lucide-react";
import { useCart, useAccount, useT, CartDrawer, MarketSwitcher } from "@nevios/storefront-kit";

import { shop } from "../../nevios.config";
import { useMarketData, marketHref, MARKET_COOKIE } from "../lib/market";

export function Header() {
  const t = useT();
  const { itemCount } = useCart();
  const { signedIn } = useAccount();
  const [cartOpen, setCartOpen] = React.useState(false);
  const { markets, market, locale, strategy, pathPrefix } = useMarketData();
  const loc = useLocation();

  const onCookieSelect = (m: { handle: string }) => {
    document.cookie = `${MARKET_COOKIE}=${m.handle}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--hairline)] bg-card">
      <div className="section-bb flex h-16 items-center justify-between gap-6">
        <Link
          to="/"
          className="font-display text-2xl leading-none font-bold tracking-tight text-brand"
        >
          {shop.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {shop.nav.map((item) => (
            <Link
              key={item.handle}
              to={`/collections/${item.handle}`}
              className="text-sm font-medium text-fg-2 transition-colors duration-base hover:text-coral"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <MarketSwitcher
            markets={markets}
            current={market}
            hrefFor={strategy === "cookie" ? undefined : (m) => marketHref(m, loc.pathname, pathPrefix)}
            onSelect={strategy === "cookie" ? onCookieSelect : undefined}
          />
          <Link
            to="/account"
            aria-label={t(signedIn ? "account.title" : "account.signIn")}
            className="inline-flex size-9 items-center justify-center rounded-pill text-fg-2 transition-colors duration-base hover:bg-paper-cream hover:text-coral"
          >
            <User className="size-5" />
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-4 py-2 text-sm font-medium text-white transition-[background-color,transform] duration-base hover:bg-[var(--brand-hover)] active:scale-[0.98]"
          >
            <ShoppingBag className="size-4" />
            <span>{itemCount > 0 ? itemCount : t("cart.title")}</span>
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} checkoutHref="/checkout" locale={locale} />
    </header>
  );
}
