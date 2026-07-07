import { DesignShell, Specimen, PropsTable, RuleBox } from "~/design/design-shell";
import { ProductRail } from "~/components/sections/product-rail";

export function meta() {
  return [{ title: "Product Rail — /design" }];
}

const DEMO_PRODUCTS = [
  { href: "#", name: "Compass Trail Cap", image: "", price: 590, currency: "CZK" },
  { href: "#", name: "Piston Engineer Boots", image: "", price: 2490, originalPrice: 2990, currency: "CZK", badge: { variant: "sale" as const } },
  { href: "#", name: "Dune Linen Shorts", image: "", price: 890, currency: "CZK", badge: { variant: "new" as const } },
  { href: "#", name: "Iron Skillet 26cm", image: "", price: 1290, currency: "CZK" },
];

export default function ProductRailSpecimen() {
  return (
    <DesignShell
      activeGroup="sections"
      activeSlug="product-rail"
      title="Product Rail"
      description="Titled product carousel — grid (responsive) or scroll (horizontal). Missing images fall back to a neutral placeholder, never a broken <img>."
    >
      <Specimen>
        <ProductRail
          eyebrow="Nejprodávanější"
          title="Bestsellery"
          description="Produkty, které si zákazníci vybírají nejčastěji."
          products={DEMO_PRODUCTS}
          viewAllHref="#"
          layout="scroll"
          endLink={{ href: "#", label: "Prohlédnout celou kolekci" }}
        />
      </Specimen>
      <PropsTable
        rows={[
          { name: "products", type: "RailProduct[]", description: "href, name, image, price, originalPrice, badge, rating." },
          { name: "layout", type: '"grid" | "scroll"', default: '"grid"', description: "Responsive grid or horizontal scroll rail." },
          { name: "viewAllHref", type: "string", description: "Optional \"Zobrazit vše\" link in the header." },
          { name: "endLink", type: "{ href, label }", description: "Closing CTA card slotted at the end of the rail." },
          { name: "cardStack", type: "boolean", description: "Neighbor-tuck hover effect (.card-stack)." },
        ]}
      />
      <RuleBox>
        Feed it real catalog data via <code>productToRailItem()</code> (
        <code>app/lib/product-to-rail.ts</code>) — never hand-write product objects outside
        specimens/demos.
      </RuleBox>
    </DesignShell>
  );
}
