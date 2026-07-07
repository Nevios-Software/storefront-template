import { data } from "react-router";
import { ProductDetailPage, AddToCart, ProductJsonLd, BreadcrumbJsonLd } from "@nevios/storefront-kit";
import { StorefrontError } from "@nevios/storefront-js";

import type { Route } from "./+types/products.$handle";
import { getServerClient } from "../lib/nevios.server";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

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

export default function ProductRoute({ loaderData }: Route.ComponentProps) {
  const { locale } = useMarketData();
  const { product, origin, url } = loaderData;
  return (
    <>
      {/* Structured data for rich results — price, availability, breadcrumb. */}
      <ProductJsonLd product={product} url={url} baseUrl={origin} brandName={shop.name} />
      <BreadcrumbJsonLd
        items={[
          { name: shop.name, url: origin + "/" },
          { name: product.title, url },
        ]}
      />
      <ProductDetailPage
        product={product}
        locale={locale}
        addToCart={(variant) => <AddToCart variant={variant} />}
      />
    </>
  );
}
