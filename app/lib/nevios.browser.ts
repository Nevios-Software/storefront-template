/**
 * Browser storefront client — the one the kit providers (CartProvider,
 * CheckoutProvider) use. Tokens live in a cookie (not localStorage) so the
 * server render and the client share one session. Created once from the
 * publishable config the root loader passes down (the key is publishable).
 */

import {
  createStorefrontClient,
  cookieStorage,
  memoryStorage,
  type StorefrontClient,
} from "@nevios/storefront-js";

export interface PublicConfig {
  publishableKey: string;
  apiUrl: string;
  market: string;
  locale: string;
}

function browserCookies() {
  return cookieStorage({
    get: (k) => {
      const m = document.cookie.match(new RegExp(`(?:^|; )${k}=([^;]*)`));
      return m ? decodeURIComponent(m[1]) : null;
    },
    set: (k, v) => {
      document.cookie = `${k}=${encodeURIComponent(v)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
    },
    remove: (k) => {
      document.cookie = `${k}=; Path=/; SameSite=Lax; Max-Age=0`;
    },
  });
}

let singleton: StorefrontClient | null = null;

export function getBrowserClient(config: PublicConfig): StorefrontClient {
  if (singleton) return singleton;
  singleton = createStorefrontClient({
    publishableKey: config.publishableKey,
    apiUrl: config.apiUrl,
    market: config.market,
    locale: config.locale,
    // SSR render of the providers makes no calls — a throwaway memory store is
    // fine there; the browser gets the real cookie-shared session.
    storage: typeof document === "undefined" ? memoryStorage() : browserCookies(),
  });
  return singleton;
}
