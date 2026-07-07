/**
 * Market resolution bound to your `shop` config — how the storefront decides
 * which market (and therefore currency + locale) a request belongs to. The pure
 * logic lives in `market-resolve.ts`; this binds it to the config and the React
 * side (`useMarketData`).
 */

import { useRouteLoaderData } from "react-router";

import { shop, defaultLocale, type MarketConfig } from "../../nevios.config";
import {
  pickMarket,
  buildAlternates,
  marketHref as marketHrefCore,
  readCookie,
  MARKET_COOKIE,
  type ResolvedMarket,
  type HreflangAlternate,
} from "./market-resolve";

export { MARKET_COOKIE };
export type { ResolvedMarket, HreflangAlternate };

export function resolveMarket(input: {
  host?: string | null;
  pathname?: string | null;
  cookieMarket?: string | null;
}): ResolvedMarket {
  return pickMarket(shop, input);
}

export function resolveMarketFromRequest(request: Request): ResolvedMarket {
  // The "path" strategy needs a market-prefixed ($market) route layer that this
  // starter doesn't scaffold yet — without it every /<market>/… URL (and the
  // hreflang that advertises it) would 404. Fail loudly instead of shipping 404s.
  if (shop.strategy === "path") {
    throw new Error(
      'nevios.config strategy "path" is not wired yet: it needs a ($market) route ' +
        'layer. Use "domain" or "cookie" for now (see STOREFRONT_PROGRESS.md → ' +
        '"($market) route layer" follow-up).',
    );
  }
  const url = new URL(request.url);
  return pickMarket(shop, {
    host: url.host,
    pathname: url.pathname,
    cookieMarket: readCookie(request.headers.get("Cookie"), MARKET_COOKIE),
  });
}

export function buildHreflangAlternates(url: URL, resolved: ResolvedMarket): HreflangAlternate[] {
  return buildAlternates(shop, url, resolved);
}

/** The URL to switch to a given market (domain / path strategies). */
export function marketHref(
  m: { handle: string; domain?: string | null },
  currentPath: string,
  pathPrefix: string,
): string {
  return marketHrefCore(shop, m, currentPath, pathPrefix);
}

// ── Client side ──────────────────────────────────────────────────────

export interface RootMarketData {
  market: string;
  locale: string;
  markets: MarketConfig[];
  pathPrefix: string;
  strategy: string;
}

/** The resolved market + the full market list, from the root loader. Safe to
 *  call anywhere under the root route; falls back to config defaults. */
export function useMarketData(): RootMarketData {
  const root = useRouteLoaderData("root") as Partial<RootMarketData> | undefined;
  return {
    market: root?.market ?? shop.defaultMarket,
    locale: root?.locale ?? defaultLocale,
    markets: root?.markets ?? Object.values(shop.markets),
    pathPrefix: root?.pathPrefix ?? "",
    strategy: root?.strategy ?? shop.strategy,
  };
}
