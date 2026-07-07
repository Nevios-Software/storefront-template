import { DesignShell, Specimen, PropsTable, RuleBox } from "~/design/design-shell";
import { HeroCarousel } from "~/components/sections/hero-carousel";

export function meta() {
  return [{ title: "Hero Carousel — /design" }];
}

export default function HeroCarouselSpecimen() {
  return (
    <DesignShell
      activeGroup="sections"
      activeSlug="hero-carousel"
      title="Hero Carousel"
      description="Full-bleed rotating banner. CSS scroll-snap, no library. Every slide's copy/tone/CTA is a prop — the component has zero baked-in content."
    >
      <Specimen className="p-0 sm:p-0">
        <HeroCarousel
          autoAdvanceMs={0}
          slides={[
            {
              eyebrow: "Nová kolekce",
              title: "Vaše nová oblíbená věc.",
              description: "Čerstvý výběr, který stojí za pozornost.",
              ctaLabel: "Prozkoumat kolekci",
              ctaHref: "/collections",
              tone: "coral",
            },
            {
              eyebrow: "Kvalita",
              title: "Vyrobeno tak, aby to vydrželo.",
              description: "Pečlivě vybraní dodavatelé, materiály, na kterých záleží.",
              ctaLabel: "Náš příběh",
              ctaHref: "/o-nas",
              tone: "soil",
            },
          ]}
        />
      </Specimen>
      <PropsTable
        rows={[
          { name: "slides", type: "HeroSlide[]", description: "eyebrow, title, description, ctaLabel, ctaHref, tone." },
          { name: "tone", type: '"coral" | "peach" | "soil" | "cream"', default: '"coral"', description: "Picks the gradient/surface for that slide." },
          { name: "autoAdvanceMs", type: "number", default: "7000", description: "Auto-advance interval. 0 disables it." },
          { name: "className", type: "string", description: "Extra classes on the outer wrapper." },
        ]}
      />
      <RuleBox>
        Add/reorder/remove slides in <code>app/routes/_index.tsx</code> — this component never
        changes for a copy edit.
      </RuleBox>
    </DesignShell>
  );
}
