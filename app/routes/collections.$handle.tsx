import { data } from "react-router";
import { CollectionPage } from "@nevios/storefront-kit";
import { StorefrontError } from "@nevios/storefront-js";

import type { Route } from "./+types/collections.$handle";
import { getServerClient } from "../lib/nevios.server";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

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
  try {
    const collection = await client.catalog.collection(params.handle);
    return { collection };
  } catch (err) {
    if (err instanceof StorefrontError && err.code === "not_found") {
      throw data("Collection not found", { status: 404 });
    }
    throw err;
  }
}

export default function CollectionRoute({ loaderData }: Route.ComponentProps) {
  const { locale } = useMarketData();
  return (
    <CollectionPage
      collection={loaderData.collection}
      productHref={(p) => `/products/${p.handle}`}
      locale={locale}
    />
  );
}
