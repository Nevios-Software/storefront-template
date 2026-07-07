/**
 * The `/design` registry — the single source of truth for what's registered
 * in this store's design system. Never list components in a markdown doc
 * (it drifts); add an entry here + a specimen route and it shows up live.
 *
 * Adding a new section/primitive? Definition of done:
 *   1. Build it under components/{sections,product,ui}/.
 *   2. Add one entry below.
 *   3. Add a specimen route `app/routes/design.<group>.<slug>.tsx` that
 *      renders it with real demo props (copy the pattern from an existing one).
 *   4. `pnpm typecheck` — the registry + routes are typed to stay in sync.
 */

export type DesignGroup = "sections" | "product" | "shared" | "primitives";

export interface DesignEntry {
  group: DesignGroup;
  slug: string;
  title: string;
  description: string;
}

export const registry: DesignEntry[] = [
  {
    group: "sections",
    slug: "hero-carousel",
    title: "Hero Carousel",
    description: "Full-bleed rotating banner — eyebrow, title, description, pill CTA, tone.",
  },
  {
    group: "sections",
    slug: "product-rail",
    title: "Product Rail",
    description: "Titled product carousel — grid or horizontal scroll, optional end-link card.",
  },
  {
    group: "sections",
    slug: "category-pills",
    title: "Category Pills",
    description: "Quick-link pill grid — icon + label + arrow CTA.",
  },
  {
    group: "sections",
    slug: "usp-bar",
    title: "USP Bar",
    description: "Trust-badge strip — shipping, returns, payment, support.",
  },
  {
    group: "sections",
    slug: "testimonials",
    title: "Testimonials",
    description: "Customer-quote grid with optional star rating.",
  },
  {
    group: "sections",
    slug: "media-text",
    title: "Media + Text",
    description: "Image + copy banner — brand story, category spotlight.",
  },
  {
    group: "sections",
    slug: "newsletter",
    title: "Newsletter",
    description: "Email-capture strip — dark or tinted surface.",
  },
  {
    group: "sections",
    slug: "faq",
    title: "FAQ",
    description: "Accordion FAQ (shadcn Accordion underneath).",
  },
  {
    group: "product",
    slug: "vertical-card",
    title: "Product Card",
    description: "framed / plain / story variants, badges, quick-add, swatches.",
  },
  {
    group: "product",
    slug: "pdp-elements",
    title: "PDP Elements",
    description: "Gallery, variant selector, stock pill, add-to-cart — the buy-panel building blocks.",
  },
  {
    group: "shared",
    slug: "media-image",
    title: "Media Image",
    description: "The <img> replacement — empty/missing src renders a neutral placeholder.",
  },
  {
    group: "shared",
    slug: "pagination",
    title: "Pagination",
    description: "URL-driven ?page=N links — SSR'd, shareable, back-button friendly.",
  },
  {
    group: "primitives",
    slug: "overview",
    title: "Primitives",
    description: "shadcn/ui base — button, input, badge, accordion, tabs, select, dialog, sheet, skeleton, checkbox.",
  },
];

export function registryByGroup(group: DesignGroup): DesignEntry[] {
  return registry.filter((e) => e.group === group);
}

export function designPath(entry: Pick<DesignEntry, "group" | "slug">): string {
  return `/design/${entry.group}/${entry.slug}`;
}
