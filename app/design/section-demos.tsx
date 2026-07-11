import {
  Gift,
  Headset,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  Truck,
} from "lucide-react";

import { HeroCarousel } from "~/components/sections/hero-carousel";
import { ProductRail } from "~/components/sections/product-rail";
import { CategoryPills } from "~/components/sections/category-pills";
import { UspBar } from "~/components/sections/usp-bar";
import { Testimonials } from "~/components/sections/testimonials";
import { MediaText } from "~/components/sections/media-text";
import { Newsletter } from "~/components/sections/newsletter";
import { Faq } from "~/components/sections/faq";

/**
 * Live demos of every registered SECTION, keyed by registry slug. The /design
 * landing renders these inline so the whole library is visible on one page (not
 * just links). Demo props mirror how each section is used on a real page.
 */
const RAIL_PRODUCTS = [
  { href: "#cap", name: "Compass Trail Cap", image: "", price: 590, currency: "CZK" },
  { href: "#boots", name: "Piston Engineer Boots", image: "", price: 2490, originalPrice: 2990, currency: "CZK", badge: { variant: "sale" as const } },
  { href: "#shorts", name: "Dune Linen Shorts", image: "", price: 890, currency: "CZK", badge: { variant: "new" as const } },
  { href: "#skillet", name: "Iron Skillet 26cm", image: "", price: 1290, currency: "CZK" },
];

export const SECTION_DEMOS: Record<string, React.ReactNode> = {
  "hero-carousel": (
    <HeroCarousel
      autoAdvanceMs={0}
      slides={[
        {
          eyebrow: "Nová kolekce",
          title: "Vaše nová oblíbená věc.",
          description: "Čerstvý výběr, který stojí za pozornost.",
          ctaLabel: "Prozkoumat kolekci",
          ctaHref: "#",
          tone: "coral",
        },
        {
          eyebrow: "Kvalita",
          title: "Vyrobeno tak, aby to vydrželo.",
          description: "Pečlivě vybraní dodavatelé, materiály, na kterých záleží.",
          ctaLabel: "Náš příběh",
          ctaHref: "#",
          tone: "soil",
        },
      ]}
    />
  ),
  "product-rail": (
    <ProductRail
      eyebrow="Nejprodávanější"
      title="Bestsellery"
      description="Produkty, které si zákazníci vybírají nejčastěji."
      products={RAIL_PRODUCTS}
      viewAllHref="#"
      layout="scroll"
      endLink={{ href: "#", label: "Prohlédnout celou kolekci" }}
    />
  ),
  "category-pills": (
    <CategoryPills
      size="lg"
      pills={[
        { href: "#novinky", label: "Novinky", icon: Sparkles },
        { href: "#bestsellery", label: "Nejprodávanější", icon: TrendingUp },
        { href: "#vyprodej", label: "Výprodej", icon: Tag },
        { href: "#darky", label: "Dárky", icon: Gift },
      ]}
    />
  ),
  "usp-bar": (
    <UspBar
      items={[
        { icon: Truck, label: "Doprava zdarma", description: "Při objednávce nad 999 Kč" },
        { icon: RotateCcw, label: "30 dní na vrácení", description: "Bez udání důvodu" },
        { icon: ShieldCheck, label: "Bezpečná platba", description: "Karta, převod, na dobírku" },
        { icon: Headset, label: "Zákaznická podpora", description: "Jsme tu pro vás 7 dní v týdnu" },
      ]}
    />
  ),
  testimonials: (
    <Testimonials
      eyebrow="Recenze"
      title="Co říkají zákazníci"
      testimonials={[
        { name: "Jana K.", quote: "Objednávka dorazila druhý den a balení bylo perfektní.", rating: 5 },
        { name: "Tomáš V.", quote: "Kvalita přesně podle popisu, komunikace bezproblémová.", rating: 5 },
        { name: "Petra S.", quote: "Vrácení proběhlo hladce, žádné zbytečné papírování.", rating: 4 },
      ]}
    />
  ),
  "media-text": (
    <MediaText
      eyebrow="Náš příběh"
      title="Vyrobeno s péčí, doručeno rychle."
      description="Od výběru materiálů po zabalení poslední objednávky — na každém kroku nám záleží na detailu."
      ctaLabel="Více o nás"
      ctaHref="#"
      tone="cream"
    />
  ),
  newsletter: (
    <Newsletter
      eyebrow="Buďte v obraze"
      title="Novinky a slevy přímo do e-mailu"
      description="Žádný spam — jen nové produkty a příležitostné akce."
    />
  ),
  faq: (
    <Faq
      eyebrow="Časté dotazy"
      title="Než objednáte"
      items={[
        { question: "Jak dlouho trvá doručení?", answer: "Standardní doručení trvá 1–3 pracovní dny." },
        { question: "Můžu zboží vrátit?", answer: "Ano, do 30 dnů od doručení bez udání důvodu." },
      ]}
    />
  ),
};
