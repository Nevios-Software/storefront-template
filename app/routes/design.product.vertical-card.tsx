import { DesignShell, Specimen, PropsTable, RuleBox } from "~/design/design-shell";
import { VerticalCard } from "~/components/product/vertical-card";

export function meta() {
  return [{ title: "Product Card — /design" }];
}

export default function VerticalCardSpecimen() {
  return (
    <DesignShell
      activeGroup="product"
      activeSlug="vertical-card"
      title="Product Card"
      description="The one product card. framed / plain / story variants, badges, quick-add, ratings, swatches. A missing image renders a neutral placeholder, never a broken <img>."
    >
      <Specimen>
        <div className="grid gap-4 sm:grid-cols-3">
          <VerticalCard
            href="#"
            name="Compass Trail Cap"
            image=""
            price={590}
            variant="framed"
            badge={{ label: "Novinka", tone: "new" }}
          />
          <VerticalCard
            href="#"
            name="Piston Engineer Boots"
            image=""
            price={2490}
            originalPrice={2990}
            variant="framed"
            badge={{ label: "Sleva", tone: "sale" }}
            rating={{ value: 4.5, count: 128 }}
          />
          <VerticalCard href="#" name="Dune Linen Shorts" image="" price={890} variant="plain" />
        </div>
      </Specimen>
      <PropsTable
        rows={[
          { name: "variant", type: '"framed" | "plain" | "story"', default: '"framed"', description: "Outer frame vs. flat vs. full-bleed image overlay." },
          { name: "image", type: "string", description: "Nevios Media CDN URL. Empty → placeholder icon, not a broken image." },
          { name: "badge", type: "{ label, tone: 'new'|'sale'|'info' }", description: "Corner chip." },
          { name: "quickAdd", type: '"none" | "icon" | "wide" | "floating"', default: '"none"', description: "Add-to-cart affordance style." },
          { name: "rating", type: "{ value, count }", description: "Star row — header or below-info position." },
          { name: "swatches", type: "{ color, label? }[]", description: "Color/variant dots, max 4 shown + overflow count." },
        ]}
      />
      <RuleBox>
        This is the ONE product card. Don't fork a second one for a new listing — add a variant
        prop instead.
      </RuleBox>
    </DesignShell>
  );
}
