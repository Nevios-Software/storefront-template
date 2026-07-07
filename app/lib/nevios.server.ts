/**
 * Per-request storefront client for loaders + actions (SSR). The cart /
 * checkout tokens ride in a cookie so the server render and the browser see the
 * same session — `getServerClient` binds the SDK's cookie storage to the
 * incoming Request; `commitClient` flushes any token writes onto the Response.
 *
 *   const { client, commit } = getServerClient(request, env);
 *   const cart = await client.cart.get();
 *   return data({ cart }, { headers: await commit() });
 */

import { createStorefrontClient, cookieStorage } from "@nevios/storefront-js";

import { resolveStore } from "./storefront.server";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function parseCookie(header: string | null, name: string): string | null {
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

export async function getServerClient(request: Request, env: Env) {
  const header = request.headers.get("Cookie");
  const writes = new Map<string, string | null>(); // pending Set-Cookie ops

  // Resolve which store this request is for (by Host → publishable key + market),
  // falling back to the build-time env config for single-tenant / local dev.
  const store = await resolveStore(request, env);

  const client = createStorefrontClient({
    publishableKey: store.publishableKey,
    apiUrl: env.NEVIOS_API_URL,
    market: store.market,
    locale: store.locale,
    storage: cookieStorage({
      get: (k) => (writes.has(k) ? writes.get(k)! : parseCookie(header, k)),
      set: (k, v) => void writes.set(k, v),
      remove: (k) => void writes.set(k, null),
    }),
  });

  /** Serialize pending token writes into a Headers with Set-Cookie entries. */
  async function commit(): Promise<Headers> {
    const headers = new Headers();
    for (const [k, v] of writes) {
      // Not HttpOnly: the cart/checkout token is a capability the browser-side
      // kit providers also read (one shared session across SSR + client). It's
      // not an auth credential — losing it just starts a new cart.
      const attrs = "Path=/; SameSite=Lax";
      headers.append(
        "Set-Cookie",
        v === null
          ? `${k}=; ${attrs}; Max-Age=0`
          : `${k}=${encodeURIComponent(v)}; ${attrs}; Max-Age=${MAX_AGE}`,
      );
    }
    return headers;
  }

  return { client, commit, store };
}
