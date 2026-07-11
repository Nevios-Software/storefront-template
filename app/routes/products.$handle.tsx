import { data } from "react-router";
import { StorefrontError } from "@nevios/storefront-js";

import type { Route } from "./+types/products.$handle";
import { getServerClient } from "../lib/nevios.server";
import { shop } from "../../nevios.config";
import { resolveProductTemplate } from "../product-templates/registry";

export function meta({ data: d }: Route.MetaArgs) {
  const title = d?.product?.seo_title || d?.product?.title;
  return [
    { title: title ? `${title} · ${shop.name}` : shop.name },
    { name: "description", content: d?.product?.seo_description ?? "" },
  ];
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  };
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { client } = await getServerClient(request, context.cloudflare.env);
  try {
    const product = await client.catalog.product(params.handle);
    const u = new URL(request.url);
    return { product, origin: u.origin, url: u.origin + u.pathname };
  } catch (err) {
    if (err instanceof StorefrontError && err.code === "not_found") {
      throw data("Product not found", { status: 404 });
    }
    throw err;
  }
}

/**
 * Product detail — one route, per-product template dispatch. The merchant picks
 * the template in the dashboard ("Template ▾"); it arrives as
 * `product.template_handle`. `null`/unknown -> the `default` PDP. Templates live
 * in `app/product-templates/` (registered in `registry.ts`).
 */
export default function ProductRoute({ loaderData }: Route.ComponentProps) {
  const { product, origin, url } = loaderData;
  const Template = resolveProductTemplate(product.template_handle);
  return <Template product={product} origin={origin} url={url} />;
}
