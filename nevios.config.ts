import type { StorefrontTheme } from "@nevios/storefront-kit";

/**
 * Demo config for the example storefront — a two-market shop (Czechia + Germany)
 * using the "cookie" strategy so you can switch markets on one dev origin. See
 * `app/lib/market.ts` for the resolver and `nevios.config.ts` in the template
 * for the full docs.
 */

export type MarketStrategy = "domain" | "path" | "cookie";

export interface MarketConfig {
  handle: string;
  locale: string;
  label: string;
  domain?: string;
}

export const shop = {
  name: "Nevios Storefront",
  /** Header wordmark — `short` renders on mobile, `full` from the sm breakpoint. */
  logo: { short: "/n", full: "/nevios" },
  strategy: "cookie" as MarketStrategy,
  defaultMarket: "cs",
  markets: {
    cs: { handle: "cs", locale: "cs-CZ", label: "Česko" },
    // Uses the kit's bundled en pack so the UI language visibly switches in dev.
    en: { handle: "en", locale: "en-US", label: "International" },
  } as Record<string, MarketConfig>,
  nav: [] as { label: string; handle: string }[],
};

export const defaultLocale: string =
  shop.markets[shop.defaultMarket]?.locale ?? "cs-CZ";

export const theme: StorefrontTheme = {
  brand: "#111111",
  brandForeground: "#ffffff",
  background: "#ffffff",
  foreground: "#111111",
  muted: "#6b7280",
  border: "rgba(0,0,0,0.1)",
  radius: "12px",
  fontFamily: "system-ui, -apple-system, sans-serif",
};
