import { Gift, Headset, RotateCcw, ShieldCheck, Sparkles, Tag, TrendingUp, Truck } from "lucide-react";
import { type Product } from "@nevios/storefront-js";

import type { Route } from "./+types/_index";
import { getServerClient } from "../lib/nevios.server";
import { productToRailItem } from "../lib/product-to-rail";
import { HeroCarousel } from "../components/sections/hero-carousel";
import { ProductRail } from "../components/sections/product-rail";
import { CategoryPills } from "../components/sections/category-pills";
import { UspBar } from "../components/sections/usp-bar";
import { Testimonials } from "../components/sections/testimonials";
import { MediaText } from "../components/sections/media-text";
import { Newsletter } from "../components/sections/newsletter";
import { Faq } from "../components/sections/faq";
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
 * Home — a flat list of sections. Add a section: build it under
 * components/sections/, register it in /design, drop it in below.
 * Reorder / remove: just move or delete a block. No section here reads
 * or writes anything beyond its own props — see CLAUDE.md "Common tasks".
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
              eyebrow: "Nová kolekce",
              title: (
                <>
                  Vaše nová
                  <br />
                  oblíbená věc.
                </>
              ),
              description:
                "Čerstvý výběr, který stojí za pozornost — podívejte se, než se rozprodá.",
              ctaLabel: "Prozkoumat kolekci",
              ctaHref: "/collections",
              tone: "coral",
            },
            {
              eyebrow: "Kvalita",
              title: (
                <>
                  Vyrobeno tak,
                  <br />
                  aby to vydrželo.
                </>
              ),
              description: "Pečlivě vybraní dodavatelé, materiály, na kterých záleží.",
              ctaLabel: "Náš příběh",
              ctaHref: "/o-nas",
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
              description: "Naše nejnovější přírůstky — vyzkoušejte je jako první.",
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
          description="Produkty, které si zákazníci vybírají nejčastěji."
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
            { href: "/collections", label: "Novinky", icon: Sparkles },
            { href: "/collections", label: "Bestsellery", icon: TrendingUp },
            { href: "/collections", label: "Výprodej", icon: Tag },
            { href: "/collections", label: "Dárky", icon: Gift },
          ]}
        />
      </section>

      {/* 4 — TRUST / USP STRIP */}
      <section className="section-wide">
        <UspBar
          items={[
            { icon: Truck, label: "Doprava zdarma", description: "Při objednávce nad 999 Kč" },
            { icon: RotateCcw, label: "30 dní na vrácení", description: "Bez udání důvodu" },
            { icon: ShieldCheck, label: "Bezpečná platba", description: "Karta, převod, na dobírku" },
            { icon: Headset, label: "Zákaznická podpora", description: "Jsme tu pro vás 7 dní v týdnu" },
          ]}
        />
      </section>

      {/* 5 — BRAND STORY SPOTLIGHT */}
      <section className="section-wide">
        <MediaText
          eyebrow="Náš příběh"
          title="Vyrobeno s péčí, doručeno rychle."
          description="Od výběru materiálů po zabalení poslední objednávky — na každém kroku nám záleží na tom, aby k vám dorazilo přesně to, co jste si objednali."
          ctaLabel="Více o nás"
          ctaHref="/o-nas"
          tone="cream"
        />
      </section>

      {/* 6 — TESTIMONIALS */}
      <section className="section-wide">
        <Testimonials
          eyebrow="Recenze"
          title="Co říkají zákazníci"
          testimonials={[
            {
              name: "Jana K.",
              quote: "Objednávka dorazila druhý den a balení bylo perfektní. Určite budu objednávat znovu.",
              rating: 5,
            },
            {
              name: "Tomáš V.",
              quote: "Kvalita přesně podle popisu, komunikace s podporou bezproblémová.",
              rating: 5,
            },
            {
              name: "Petra S.",
              quote: "Vrácení proběhlo hladce, žádné zbytečné papírování. Doporučuji.",
              rating: 4,
            },
          ]}
        />
      </section>

      {/* 7 — NEWSLETTER */}
      <section className="section-wide">
        <Newsletter
          eyebrow="Buďte v obraze"
          title="Novinky a slevy přímo do e-mailu"
          description="Žádný spam — jen nové produkty a příležitostné akce."
        />
      </section>

      {/* 8 — FAQ */}
      <section className="section-wide">
        <Faq
          eyebrow="Časté dotazy"
          title="Než objednáte"
          items={[
            {
              question: "Jak dlouho trvá doručení?",
              answer: "Standardní doručení trvá 1–3 pracovní dny od odeslání objednávky.",
            },
            {
              question: "Můžu zboží vrátit?",
              answer: "Ano, do 30 dnů od doručení bez udání důvodu — viz stránka Doprava a platba.",
            },
            {
              question: "Jaké způsoby platby přijímáte?",
              answer: "Platební kartou, bankovním převodem a na dobírku.",
            },
            {
              question: "Jak zjistím stav své objednávky?",
              answer: "Odkaz na sledování objednávky dostanete e-mailem ihned po odeslání.",
            },
          ]}
        />
      </section>
    </div>
  );
}
