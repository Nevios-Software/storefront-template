import * as React from "react";
import { Link } from "react-router";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useCart, useAccount, useT } from "@nevios/storefront-kit";

import { shop } from "../../nevios.config";
import { MenuDrawer } from "./layout/menu-drawer";
import { SearchDrawer } from "./layout/search-drawer";
import { CartDrawer } from "./layout/cart-drawer";

/**
 * Site header — wordmark + drawer triggers. All three overlays (menu, search,
 * cart) are animated Sheets; the market picker lives in the Footer.
 */
export function Header() {
  const t = useT();
  const { itemCount } = useCart();
  const { signedIn } = useAccount();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);

  const iconBtn =
    "inline-flex size-9 items-center justify-center rounded-pill text-fg-2 transition-colors duration-base hover:bg-paper-cream hover:text-fg-1";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--hairline)] bg-card">
      <div className="section-bb flex h-16 items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-1">
          {/* Mobile menu */}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
            className={`${iconBtn} -ml-2 md:hidden`}
          >
            <Menu className="size-5" />
          </button>
          {/* Wordmark — short on mobile, full from sm (see nevios.config `logo`). */}
          <Link
            to="/"
            className="font-display text-xl leading-none font-bold tracking-tight whitespace-nowrap text-brand sm:text-2xl"
          >
            <span className="sm:hidden">{shop.logo.short}</span>
            <span className="hidden sm:inline">{shop.logo.full}</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            to="/collections"
            className="text-sm font-medium text-fg-2 transition-colors duration-base hover:text-fg-1"
          >
            Kolekce
          </Link>
          {shop.nav.map((item) => (
            <Link
              key={item.handle}
              to={`/collections/${item.handle}`}
              className="text-sm font-medium text-fg-2 transition-colors duration-base hover:text-fg-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label="Hledat"
            onClick={() => setSearchOpen(true)}
            className={iconBtn}
          >
            <Search className="size-5" />
          </button>
          {/* Desktop only — on mobile the account link lives in the menu drawer.
              (Standalone class list: iconBtn's inline-flex would fight `hidden`.) */}
          <Link
            to="/account"
            aria-label={t(signedIn ? "account.title" : "account.signIn")}
            className="hidden size-9 items-center justify-center rounded-pill text-fg-2 transition-colors duration-base hover:bg-paper-cream hover:text-fg-1 md:inline-flex"
          >
            <User className="size-5" />
          </Link>
          {/* Cart: icon (+ animated count when non-empty); label from sm up. */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={t("cart.title")}
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-3 py-2 text-sm font-medium text-white transition-[background-color,transform] duration-base hover:bg-[var(--brand-hover)] active:scale-[0.98] sm:px-4"
          >
            <ShoppingBag className="size-4" />
            {itemCount > 0 ? (
              <span key={itemCount} className="num num-roll">
                {itemCount}
              </span>
            ) : (
              <span className="hidden sm:inline">{t("cart.title")}</span>
            )}
          </button>
        </div>
      </div>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
