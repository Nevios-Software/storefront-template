import { data } from "react-router";
import { StorefrontError, type ProductSort } from "@nevios/storefront-js";

import type { Route } from "./+types/collections.$handle";
import { getServerClient } from "../lib/nevios.server";
import { shop } from "../../nevios.config";
import {
  COLLECTION_PAGE_SIZE,
  COLLECTION_SORTS,
  resolveCollectionTemplate,
} from "../collection-templates/registry";

export function meta({ data: d }: Route.MetaArgs) {
  return [{ title: d?.collection ? `${d.collection.title} · ${shop.name}` : shop.name }];
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  };
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { client } = await getServerClient(request, context.cloudflare.env);
  const u = new URL(request.url);
  const page = Math.max(1, Number(u.searchParams.get("page")) || 1);
  const sortParam = u.searchParams.get("sort");
  const sort: ProductSort = COLLECTION_SORTS.some((s) => s.value === sortParam)
    ? (sortParam as ProductSort)
    : "newest";
  try {
    // Collection = presentation meta; the product page/sort itself comes from
    // the products list endpoint so pagination + sorting stay server-driven.
    const [collection, list] = await Promise.all([
      client.catalog.collection(params.handle),
      client.catalog.products({
        collection: params.handle,
        sort,
        offset: (page - 1) * COLLECTION_PAGE_SIZE,
        limit: COLLECTION_PAGE_SIZE,
      }),
    ]);
    return { collection, products: list.products, total: list.total_count, page, sort };
  } catch (err) {
    if (err instanceof StorefrontError && err.code === "not_found") {
      throw data("Collection not found", { status: 404 });
    }
    throw err;
  }
}

/**
 * Collection listing — one route, per-collection template dispatch. The merchant
 * picks the template in the dashboard ("Template ▾"); it arrives as
 * `collection.template_handle`. `null`/unknown -> the `default` listing.
 * Templates live in `app/collection-templates/` (registered in `registry.ts`).
 */
export default function CollectionRoute({ loaderData }: Route.ComponentProps) {
  const { collection, products, total, page, sort } = loaderData;
  const Template = resolveCollectionTemplate(collection.template_handle);
  return <Template collection={collection} products={products} total={total} page={page} sort={sort} />;
}
