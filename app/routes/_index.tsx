import { Droplet, Scissors, Sparkles, Sun } from "lucide-react";
import { type Product } from "@nevios/storefront-js";

import type { Route } from "./+types/_index";
import { getServerClient } from "../lib/nevios.server";
import { productToRailItem } from "../lib/product-to-rail";
import { HeroCarousel } from "../components/sections/hero-carousel";
import { ProductRail } from "../components/sections/product-rail";
import { CategoryPills } from "../components/sections/category-pills";
import { shop } from "../../nevios.config";

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data?.storeName || shop.name }];
}

// Catalog is public + edge-cacheable: let Cloudflare cache the document.
export function headers() {
  return {
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  };
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { client, store } = await getServerClient(request, context.cloudflare.env);
  const catalog = await client.catalog.products({ limit: 12 }).catch((err) => {
    console.error("catalog load failed", err);
    return { products: [] as Product[] };
  });
  return {
    products: catalog.products,
    storeName: store.name,
    locale: store.locale ?? "cs-CZ",
  };
}

/**
 * BODYBE homepage — section order mirrors the Bodybe Next store:
 *   1. Hero carousel (edge-to-edge, 3 gradient slides)
 *   2. Bestsellers rail (real catalog via productToRailItem)
 *   3. Category pills
 */
export default function Home({ loaderData }: Route.ComponentProps) {
  const { products, locale } = loaderData;

  return (
    <div className="space-y-12 py-6 sm:space-y-16 sm:py-8 lg:space-y-20 lg:py-10">
      {/* 1 — HERO CAROUSEL (edge-to-edge) */}
      <section>
        <HeroCarousel
          slides={[
            {
              eyebrow: "Anti-aging",
              title: (
                <>
                  Vrásky
                  <br />
                  mluví za tebe?
                </>
              ),
              description:
                "Zkus PDRN sérum s polynukleotidy — regenerace, kterou znají estetické kliniky, teď v denní rutině.",
              ctaLabel: "Vyzkoušet PDRN",
              ctaHref: "/products/pdrn-serum",
              tone: "coral",
            },
            {
              eyebrow: "Smart beauty",
              title: (
                <>
                  Krása
                  <br />
                  začíná zevnitř.
                </>
              ),
              description:
                "Chytrá kosmetika a doplňky stravy formulované pro ženy, které vědí, co chtějí.",
              ctaLabel: "Prozkoumat e-shop",
              ctaHref: "/collections",
              tone: "soil",
            },
            {
              eyebrow: "Novinky",
              title: (
                <>
                  Čerstvě
                  <br />
                  v nabídce.
                </>
              ),
              description:
                "Naše nejnovější přírůstky — vyzkoušej je první, než se rozkřiknou.",
              ctaLabel: "Zobrazit novinky",
              ctaHref: "/collections",
              tone: "coral",
            },
          ]}
        />
      </section>

      {/* 2 — BESTSELLERS RAIL (real catalog) */}
      <section className="section-wide">
        <ProductRail
          eyebrow="Nejprodávanější"
          title="Bestsellery"
          description="Produkty, které milují tisíce žen po celé ČR."
          products={products.map((p) => productToRailItem(p, locale))}
          viewAllHref="/collections"
          layout="scroll"
          endLink={{ href: "/collections", label: "Prohlédnout celou kolekci" }}
        />
      </section>

      {/* 3 — CATEGORY PILLS */}
      <section className="section-wide">
        <CategoryPills
          size="lg"
          pills={[
            { href: "/collections", label: "Opalování", icon: Sun },
            { href: "/collections", label: "Tělo & Glow", icon: Sparkles },
            { href: "/collections", label: "Anti-aging", icon: Droplet },
            { href: "/collections", label: "Vlasy", icon: Scissors },
          ]}
        />
      </section>
    </div>
  );
}
