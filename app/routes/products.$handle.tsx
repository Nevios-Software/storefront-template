import { useState } from "react";
import { data, Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { PriceMoney, ProductJsonLd, BreadcrumbJsonLd } from "@nevios/storefront-kit";
import { StorefrontError, type ProductVariant } from "@nevios/storefront-js";

import type { Route } from "./+types/products.$handle";
import { getServerClient } from "../lib/nevios.server";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";
import { ProductGallery } from "../components/product/product-gallery";
import { VariantSelector } from "../components/product/variant-selector";
import { StockPill } from "../components/product/stock-pill";
import { AddToCartButton } from "../components/product/add-to-cart-button";

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
 * Product detail — owned layout (gallery | buy panel), commerce via the kit
 * (useCart through AddToCartButton, PriceMoney formatting, JSON-LD).
 */
export default function ProductRoute({ loaderData }: Route.ComponentProps) {
  const { locale } = useMarketData();
  const { product, origin, url } = loaderData;
  const [variant, setVariant] = useState<ProductVariant | null>(product.variants[0] ?? null);

  return (
    <div className="section-wide py-8 lg:py-12">
      {/* Structured data for rich results — price, availability, breadcrumb. */}
      <ProductJsonLd product={product} url={url} baseUrl={origin} brandName={shop.name} />
      <BreadcrumbJsonLd
        items={[
          { name: shop.name, url: origin + "/" },
          { name: product.title, url },
        ]}
      />

      <nav aria-label="Drobečková navigace" className="mb-6 flex items-center gap-1.5 text-xs text-fg-3">
        <Link to="/" className="transition-colors hover:text-fg-1">
          Domů
        </Link>
        <ChevronRight className="size-3" aria-hidden />
        <Link to="/collections" className="transition-colors hover:text-fg-1">
          Produkty
        </Link>
        <ChevronRight className="size-3" aria-hidden />
        <span className="truncate text-fg-1">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery media={product.media} alt={product.title} />

        {/* Buy panel */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div>
            {product.vendor && <p className="eyebrow mb-2">{product.vendor}</p>}
            <h1 className="text-2xl font-bold text-fg-1 sm:text-3xl">{product.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {variant && (
              <span className="num text-2xl font-bold text-fg-1">
                <PriceMoney money={variant.price} locale={locale} />
              </span>
            )}
            <StockPill variant={variant} />
          </div>

          <VariantSelector product={product} onChange={setVariant} />

          <AddToCartButton variant={variant} />

          {product.description_html && (
            <div
              className="prose-sm mt-2 max-w-none text-sm leading-relaxed text-fg-2 [&_a]:underline [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-fg-1 [&_h3]:mt-3 [&_h3]:font-semibold [&_h3]:text-fg-1 [&_li]:mt-1 [&_p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5"
              // Trusted content: the merchant's own product description from the dashboard.
              dangerouslySetInnerHTML={{ __html: product.description_html }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
