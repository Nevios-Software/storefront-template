/**
 * /sitemap.xml — resource route (no UI, the loader IS the response).
 *
 * The sitemap is assembled from three sources:
 *   1. `/` — the home page.
 *   2. Custom routes from the Nevios route registry (`client.routes.list()`),
 *      skipping anything marked `seo.noindex`. These carry `lastmod`.
 *   3. Entity URLs derived from the registry's `patterns` expanded over the
 *      live catalog (`/products/{handle}` × products, same for collections).
 *
 * `routes.list()` throws when the publishable key isn't channel-bound (common
 * with dev keys) — we fall back to the default patterns and no custom routes,
 * so the sitemap still serves the catalog.
 */

import type { StorefrontRoutes } from "@nevios/storefront-js";

import { getServerClient } from "../lib/nevios.server";

const MAX_PRODUCTS = 500;
const MAX_COLLECTIONS = 100;
const PAGE_SIZE = 100;

const FALLBACK_ROUTES: Pick<StorefrontRoutes, "patterns" | "routes"> = {
  patterns: { product: "/products/{handle}", collection: "/collections/{handle}" },
  routes: [],
};

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface SitemapEntry {
  loc: string;
  lastmod?: string | null;
  changefreq?: string;
  priority?: number;
}

function urlTag({ loc, lastmod, changefreq, priority }: SitemapEntry): string {
  const parts = [`    <loc>${xmlEscape(loc)}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${xmlEscape(lastmod)}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${xmlEscape(changefreq)}</changefreq>`);
  if (priority != null) parts.push(`    <priority>${priority}</priority>`);
  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

export async function loader({
  request,
  context,
}: {
  request: Request;
  context: { cloudflare: { env: Env } };
}) {
  const origin = new URL(request.url).origin;
  const { client } = await getServerClient(request, context.cloudflare.env);

  // Route registry — throws on non-channel-bound keys, so it must be caught.
  let registry: Pick<StorefrontRoutes, "patterns" | "routes">;
  try {
    registry = await client.routes.list();
  } catch (err) {
    console.error("sitemap: routes.list failed, using fallback patterns", err);
    registry = FALLBACK_ROUTES;
  }

  // Products — paginate the SDK up to MAX_PRODUCTS.
  const productHandles: string[] = [];
  if (registry.patterns.product) {
    for (let offset = 0; offset < MAX_PRODUCTS; offset += PAGE_SIZE) {
      const page = await client.catalog
        .products({ limit: Math.min(PAGE_SIZE, MAX_PRODUCTS - offset), offset })
        .catch((err) => {
          console.error("sitemap: products page failed", err);
          return { products: [], total_count: 0 };
        });
      for (const p of page.products) productHandles.push(p.handle);
      if (page.products.length < PAGE_SIZE || productHandles.length >= page.total_count) break;
    }
  }

  const collections = registry.patterns.collection
    ? await client.catalog.collections({ limit: MAX_COLLECTIONS }).catch((err) => {
        console.error("sitemap: collections failed", err);
        return { collections: [], total_count: 0 };
      })
    : { collections: [] };

  const entries: SitemapEntry[] = [{ loc: `${origin}/` }];

  for (const route of registry.routes) {
    if (route.seo?.noindex) continue;
    entries.push({
      loc: `${origin}${route.path}`,
      lastmod: route.lastmod,
      changefreq: route.seo?.changefreq,
      priority: route.seo?.priority,
    });
  }

  for (const handle of productHandles) {
    entries.push({ loc: `${origin}${registry.patterns.product!.replace("{handle}", handle)}` });
  }
  for (const c of collections.collections) {
    entries.push({ loc: `${origin}${registry.patterns.collection!.replace("{handle}", c.handle)}` });
  }

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries.map(urlTag),
    `</urlset>`,
    ``,
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
