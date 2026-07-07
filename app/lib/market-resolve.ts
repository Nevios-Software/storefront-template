/**
 * Pure market-resolution logic — no framework imports, so it's unit-testable in
 * isolation. `market.ts` binds these to your `shop` config and the React side.
 */

export type MarketStrategy = "domain" | "path" | "cookie";

export interface MarketEntry {
  handle: string;
  locale: string;
  label: string;
  domain?: string;
}

export interface MarketResolveConfig {
  strategy: MarketStrategy;
  defaultMarket: string;
  markets: Record<string, MarketEntry>;
}

export interface ResolvedMarket {
  handle: string;
  locale: string;
  /** URL prefix for the "path" strategy ("" otherwise). Prepend to links. */
  pathPrefix: string;
}

export interface HreflangAlternate {
  hrefLang: string;
  href: string;
}

/** Cookie the switcher sets in "cookie" strategy. */
export const MARKET_COOKIE = "nv_market";

function fallback(cfg: MarketResolveConfig): ResolvedMarket {
  const m = cfg.markets[cfg.defaultMarket] ?? Object.values(cfg.markets)[0];
  return { handle: m.handle, locale: m.locale, pathPrefix: "" };
}

/** Resolve a market from request signals + the configured strategy. Pure. */
export function pickMarket(
  cfg: MarketResolveConfig,
  input: { host?: string | null; pathname?: string | null; cookieMarket?: string | null },
): ResolvedMarket {
  const { markets, strategy } = cfg;

  // Honor the switch cookie ONLY under the "cookie" strategy — a stale cookie
  // must never override a domain/path-resolved market (else a returning visitor
  // is pinned to the wrong currency on the right domain for up to a year).
  if (strategy === "cookie" && input.cookieMarket && markets[input.cookieMarket]) {
    const m = markets[input.cookieMarket];
    return { handle: m.handle, locale: m.locale, pathPrefix: "" };
  }

  if (strategy === "domain" && input.host) {
    const host = input.host.toLowerCase().replace(/:\d+$/, "");
    const m = Object.values(markets).find(
      (x) => x.domain && (host === x.domain.toLowerCase() || host.endsWith(`.${x.domain.toLowerCase()}`)),
    );
    if (m) return { handle: m.handle, locale: m.locale, pathPrefix: "" };
  }

  if (strategy === "path" && input.pathname) {
    const seg = input.pathname.split("/").filter(Boolean)[0];
    const m = seg ? markets[seg] : undefined;
    if (m) return { handle: m.handle, locale: m.locale, pathPrefix: `/${m.handle}` };
  }

  return fallback(cfg);
}

/** Absolute hreflang alternates for the current page across all markets. Empty
 *  for "cookie" (one URL serves all → no per-locale alternates) or a single
 *  market. */
export function buildAlternates(
  cfg: MarketResolveConfig,
  url: { origin: string; pathname: string; search: string },
  resolved: ResolvedMarket,
): HreflangAlternate[] {
  const list = Object.values(cfg.markets);
  if (cfg.strategy === "cookie" || list.length <= 1) return [];

  const bare =
    resolved.pathPrefix && url.pathname.startsWith(resolved.pathPrefix)
      ? url.pathname.slice(resolved.pathPrefix.length) || "/"
      : url.pathname;

  const hrefFor = (mk: MarketEntry): string => {
    if (cfg.strategy === "domain" && mk.domain) return `https://${mk.domain}${bare}${url.search}`;
    if (cfg.strategy === "path") return `${url.origin}/${mk.handle}${bare === "/" ? "" : bare}${url.search}`;
    return `${url.origin}${bare}${url.search}`;
  };

  const out: HreflangAlternate[] = list.map((mk) => ({ hrefLang: mk.locale, href: hrefFor(mk) }));
  // x-default → the default market, for locales/regions matching none above.
  const def = cfg.markets[cfg.defaultMarket] ?? list[0];
  out.push({ hrefLang: "x-default", href: hrefFor(def) });
  return out;
}

/** The URL to switch to a given market (domain / path strategies). */
export function marketHref(
  cfg: MarketResolveConfig,
  m: { handle: string; domain?: string | null },
  currentPath: string,
  pathPrefix: string,
): string {
  const bare =
    pathPrefix && currentPath.startsWith(pathPrefix)
      ? currentPath.slice(pathPrefix.length) || "/"
      : currentPath;
  if (cfg.strategy === "domain" && m.domain) return `https://${m.domain}${bare}`;
  if (cfg.strategy === "path") return `/${m.handle}${bare === "/" ? "" : bare}`;
  return bare;
}

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}
