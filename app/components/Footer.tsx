import { Link, useLocation } from "react-router";
import { Globe } from "lucide-react";

import { shop } from "../../nevios.config";
import { useMarketData, marketHref, MARKET_COOKIE } from "../lib/market";

export function Footer() {
  return (
    <footer className="surface-dark mt-20">
      <div className="section-bb grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-xs">
          <span className="font-display text-2xl font-bold tracking-tight text-fg-on-dark">
            {shop.logo.full}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-fg-on-dark-muted">
            Vyrobeno s péčí, doručeno rychle.
          </p>
          <div className="mt-5">
            <MarketPicker />
          </div>
        </div>

        {/* Shop column renders only when nav items exist — an empty heading looks broken. */}
        {shop.nav.length > 0 && (
          <nav className="flex flex-col gap-2.5">
            <p className="mb-1 text-xs font-medium tracking-wide text-fg-on-dark-muted uppercase">Obchod</p>
            {shop.nav.map((item) => (
              <Link
                key={item.handle}
                to={`/collections/${item.handle}`}
                className="text-sm text-fg-on-dark/85 transition-colors duration-base hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <nav className="flex flex-col gap-2.5">
          <p className="mb-1 text-xs font-medium tracking-wide text-fg-on-dark-muted uppercase">Informace</p>
          {[
            { href: "/o-nas", label: "O nás" },
            { href: "/doprava", label: "Doprava a platba" },
            { href: "/kontakt", label: "Kontakt" },
            { href: "/obchodni-podminky", label: "Obchodní podmínky" },
          ].map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm text-fg-on-dark/85 transition-colors duration-base hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-[var(--hairline-on-dark)]">
        <div className="section-bb flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-fg-on-dark-muted">
          <span>© {new Date().getFullYear()} {shop.name}</span>
          <span>
            powered by{" "}
            <a href="https://nevios.io" target="_blank" rel="noreferrer" className="text-fg-on-dark/85 hover:text-white">
              Nevios
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/**
 * Market / language picker — lives here (not the header) to keep the chrome
 * quiet. Cookie strategy reloads with the new market cookie; path/domain
 * strategies navigate to the market's URL.
 */
function MarketPicker() {
  const { markets, market, strategy, pathPrefix } = useMarketData();
  const loc = useLocation();
  if (markets.length <= 1) return null;

  const onChange = (handle: string) => {
    const m = markets.find((x) => x.handle === handle);
    if (!m) return;
    if (strategy === "cookie") {
      document.cookie = `${MARKET_COOKIE}=${m.handle}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`;
      window.location.reload();
    } else {
      window.location.href = marketHref(m, loc.pathname, pathPrefix);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 rounded-pill bg-white/5 py-1.5 pr-3 pl-3 ring-1 ring-inset ring-[var(--hairline-on-dark)] transition-colors duration-base focus-within:ring-white/30 hover:bg-white/10">
      <Globe className="size-4 text-fg-on-dark-muted" aria-hidden />
      <span className="sr-only">Země / trh</span>
      <select
        value={market ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent text-sm font-medium text-fg-on-dark outline-none [&>option]:text-fg-1"
      >
        {markets.map((m) => (
          <option key={m.handle} value={m.handle}>
            {m.label}
          </option>
        ))}
      </select>
    </label>
  );
}
