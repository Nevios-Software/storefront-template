import type { Product } from "@nevios/storefront-js";

import { DesignShell, Specimen, PropsTable, RuleBox } from "~/design/design-shell";
import { ProductGallery } from "~/components/product/product-gallery";
import { VariantSelector } from "~/components/product/variant-selector";
import { StockPill } from "~/components/product/stock-pill";

export function meta() {
  return [{ title: "PDP Elements — /design" }];
}

/** A minimal in-memory Product for the specimens — demo only, never in routes. */
const DEMO_PRODUCT = {
  id: "0",
  handle: "demo",
  title: "Demo produkt",
  description_html: null,
  vendor: null,
  product_type: null,
  tags: [],
  seo_title: null,
  seo_description: null,
  media: [],
  options: [
    { name: "Barva", position: 1, values: ["Černá", "Písková"] },
    { name: "Velikost", position: 2, values: ["S", "M", "L"] },
  ],
  variants: [
    {
      id: "1",
      title: "Černá / S",
      sku: null,
      options: ["Černá", "S"],
      requires_shipping: true,
      price: {
        amount_cents: 89000,
        with_tax_cents: 89000,
        without_tax_cents: 73554,
        compare_at_cents: null,
        currency: "CZK",
        includes_tax: true,
      },
      availability: { status: "in_stock" as const, available_qty: 4 },
    },
    {
      id: "2",
      title: "Písková / M",
      sku: null,
      options: ["Písková", "M"],
      requires_shipping: true,
      price: {
        amount_cents: 89000,
        with_tax_cents: 89000,
        without_tax_cents: 73554,
        compare_at_cents: null,
        currency: "CZK",
        includes_tax: true,
      },
      availability: { status: "out_of_stock" as const, available_qty: 0 },
    },
  ],
  price_range: null,
  market: { handle: "cz", currency: "CZK", prices_include_tax: true },
  metafields: {},
} satisfies Product;

export default function PdpElementsSpecimen() {
  return (
    <DesignShell
      activeGroup="product"
      activeSlug="pdp-elements"
      title="PDP Elements"
      description="The buy-panel building blocks the product page composes: gallery, variant selector, stock pill. Add-to-cart lives on the PDP (needs the live cart)."
    >
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-fg-3">Product Gallery (empty media → placeholder)</h2>
          <Specimen className="max-w-sm">
            <ProductGallery media={[]} alt="Demo" />
          </Specimen>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-fg-3">Variant Selector</h2>
          <Specimen>
            <VariantSelector product={DEMO_PRODUCT} />
          </Specimen>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-fg-3">Stock Pill</h2>
          <Specimen className="flex flex-wrap gap-3">
            <StockPill variant={DEMO_PRODUCT.variants[0]} />
            <StockPill variant={DEMO_PRODUCT.variants[1]} />
          </Specimen>
        </section>
      </div>

      <PropsTable
        rows={[
          { name: "ProductGallery: media", type: "ProductMedia[]", description: "Empty → clean placeholder, never a broken <img>." },
          { name: "VariantSelector: product / onChange", type: "Product / (v) => void", description: "Resolves the matching variant from selected option pills." },
          { name: "StockPill: variant / hideInStock", type: "ProductVariant / boolean", description: "in_stock · preorder · out_of_stock label." },
          { name: "AddToCartButton: variant", type: "ProductVariant | null", description: "kit useCart().addLine — shared state with header count + drawer." },
        ]}
      />
      <RuleBox>
        Compose these in <code>app/routes/products.$handle.tsx</code>. Don't fork the PDP for a
        product type — extend via props/metafields.
      </RuleBox>
    </DesignShell>
  );
}
