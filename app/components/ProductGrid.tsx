import { Link } from "react-router";
import { PriceMoney, useT } from "@nevios/storefront-kit";
import type { Product } from "@nevios/storefront-js";

import { useMarketData } from "../lib/market";

/** Bodybe-styled responsive grid of product tiles linking to each PDP. */
export function ProductGrid({ products }: { products: Product[] }) {
  const t = useT();
  const { locale } = useMarketData();

  if (products.length === 0) {
    return <p className="text-fg-3">{t("catalog.noProducts")}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const image = product.media[0];
        const price = product.variants[0]?.price ?? null;
        return (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className="card-lift group flex flex-col overflow-hidden rounded-lg bg-card ring-hairline"
          >
            <div className="image-well aspect-square overflow-hidden rounded-none">
              {image ? (
                <img
                  src={image.url}
                  alt={image.alt ?? product.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-slow ease-spring-soft group-hover:scale-[1.04]"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <h3 className="line-clamp-2 text-sm font-medium text-fg-1">{product.title}</h3>
              {price ? (
                <span className="text-sm font-bold text-coral">
                  <PriceMoney money={price} locale={locale} />
                </span>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
