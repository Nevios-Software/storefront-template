/**
 * Multi-tenant store resolution. A single deployed runtime serves many stores;
 * each request's Host resolves to a store's publishable config (key, market,
 * theme) via the public resolve endpoint. Falls back to the build-time env key +
 * config (single-tenant / local dev) when the host isn't a provisioned store.
 *
 * Resolution is cached per-Request so the N parallel route loaders share one
 * lookup.
 */

import { resolveStorefront } from "@nevios/storefront-js";

import { resolveMarketFromRequest } from "./market";

export interface ResolvedStore {
  publishableKey: string;
  market: string | undefined;
  locale: string | undefined;
  /** Per-store theme tokens, or null → use the build-time config theme. */
  theme: Record<string, unknown> | null;
  /** Store display name, or null when falling back to config. */
  name: string | null;
  /** This store's home page handle (per-storefront, e.g. `myshop_home`). */
  homeHandle: string;
  /** The store's section library (type → definition), or null → fall back to the
   *  kit's default library. Opaque JSON; the kit types it. */
  sections: Record<string, unknown> | null;
  /** True when resolved from a provisioned storefront (vs env fallback). */
  multiTenant: boolean;
  /** True when rendering a DRAFT preview (?nevios_preview=…) — show a banner. */
  preview: boolean;
}

const cache = new WeakMap<Request, Promise<ResolvedStore>>();

export function resolveStore(request: Request, env: Env): Promise<ResolvedStore> {
  let p = cache.get(request);
  if (!p) {
    p = _resolve(request, env);
    cache.set(request, p);
  }
  return p;
}

async function _resolve(request: Request, env: Env): Promise<ResolvedStore> {
  const url = new URL(request.url);
  const host = url.hostname;
  // ?nevios_preview=<token> → render the merchant's unpublished draft theme.
  const previewToken = url.searchParams.get("nevios_preview") ?? undefined;
  const cfg = await resolveStorefront({ apiUrl: env.NEVIOS_API_URL, host, previewToken });
  if (cfg) {
    // An empty/absent library (e.g. a store provisioned before themes existed)
    // → null, so the runtime falls back to the kit's default library.
    const lib = cfg.sections as Record<string, unknown> | undefined;
    return {
      publishableKey: cfg.publishable_key,
      market: cfg.market ?? undefined,
      locale: cfg.locale ?? undefined,
      theme: cfg.theme ?? null,
      name: cfg.name,
      homeHandle: cfg.home_handle || "home",
      sections: lib && Object.keys(lib).length > 0 ? lib : null,
      multiTenant: true,
      preview: Boolean(cfg.preview),
    };
  }
  // A bad/expired preview token (preview resolve returned null) → gracefully fall
  // back to the live published theme, but WITHOUT the preview flag: a shopper who
  // follows a stale preview link sees the real live site (never an error), while
  // the merchant notices the missing preview banner. Without this, a dead token
  // would drop to the single-tenant env fallback below (wrong store entirely).
  if (previewToken) {
    const live = await resolveStorefront({ apiUrl: env.NEVIOS_API_URL, host });
    if (live) {
      const lib = live.sections as Record<string, unknown> | undefined;
      return {
        publishableKey: live.publishable_key,
        market: live.market ?? undefined,
        locale: live.locale ?? undefined,
        theme: live.theme ?? null,
        name: live.name,
        homeHandle: live.home_handle || "home",
        sections: lib && Object.keys(lib).length > 0 ? lib : null,
        multiTenant: true,
        preview: false,
      };
    }
  }
  // Fallback: build-time single-tenant config (the env key + config markets).
  const m = resolveMarketFromRequest(request);
  return {
    publishableKey: env.NEVIOS_PUBLISHABLE_KEY,
    market: m.handle,
    locale: m.locale,
    theme: null,
    name: null,
    homeHandle: "home",
    sections: null,
    multiTenant: false,
    preview: false,
  };
}
