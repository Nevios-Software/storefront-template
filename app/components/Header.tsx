import * as React from "react";
import { Link, useLocation } from "react-router";
import { Search, ShoppingBag, User } from "lucide-react";
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
      <div className="section-bb flex h-16 items-center justify-between gap-3 sm:gap-6">
        <Link
          to="/"
          className="font-display min-w-0 truncate text-lg leading-none font-bold tracking-tight whitespace-nowrap text-brand sm:text-2xl"
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <MarketSwitcher
            markets={markets}
            current={market}
            hrefFor={strategy === "cookie" ? undefined : (m) => marketHref(m, loc.pathname, pathPrefix)}
            onSelect={strategy === "cookie" ? onCookieSelect : undefined}
          />
          <Link
            to="/search"
            aria-label="Hledat"
            className="inline-flex size-9 items-center justify-center rounded-pill text-fg-2 transition-colors duration-base hover:bg-paper-cream hover:text-coral"
          >
            <Search className="size-5" />
          </Link>
          <Link
            to="/account"
            aria-label={t(signedIn ? "account.title" : "account.signIn")}
            className="inline-flex size-9 items-center justify-center rounded-pill text-fg-2 transition-colors duration-base hover:bg-paper-cream hover:text-coral"
          >
            <User className="size-5" />
          </Link>
          {/* Mobile: icon (+ count when non-empty); the text label appears from sm up. */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={t("cart.title")}
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-3 py-2 text-sm font-medium text-white transition-[background-color,transform] duration-base hover:bg-[var(--brand-hover)] active:scale-[0.98] sm:px-4"
          >
            <ShoppingBag className="size-4" />
            {itemCount > 0 ? (
              <span className="num">{itemCount}</span>
            ) : (
              <span className="hidden sm:inline">{t("cart.title")}</span>
            )}
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} checkoutHref="/checkout" locale={locale} />
    </header>
  );
}
