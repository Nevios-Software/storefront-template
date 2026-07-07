import type { Product } from "@nevios/storefront-js";
import type { RailProduct } from "~/components/sections/product-rail";

/**
 * Adapt a kit `Product` (server projection, money in minor units) into the flat
 * `RailProduct` shape the Bodybe `ProductRail`/`VerticalCard` expect. This is
 * the demo↔real seam: the card markup never changes, only its data source.
 */
export function productToRailItem(p: Product, locale = "cs-CZ"): RailProduct {
  const variant = p.variants[0];
  const money = variant?.price;
  const image = p.media[0];
  const onSale =
    money?.compare_at_cents != null && money.compare_at_cents > money.amount_cents;

  return {
    href: `/products/${p.handle}`,
    name: p.title,
    image: image?.url ?? "",
    imageAlt: image?.alt ?? p.title,
    price: (money?.amount_cents ?? 0) / 100,
    originalPrice: onSale ? (money!.compare_at_cents as number) / 100 : undefined,
    currency: money?.currency ?? "CZK",
    locale,
    badge: onSale ? { variant: "sale" } : undefined,
  };
}
