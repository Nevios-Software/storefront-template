# Your Nevios store — agent edit-guide

This repo is one store's **frontend code**. You (the agent) edit it; every push
to `main` builds on GitHub and deploys to Nevios hosting automatically. Read
this whole file before your first edit.

## What this is

- **React Router 7** (SSR, flat file routes) rendering on **Cloudflare Workers**.
- **Tailwind v4**, CSS-first — all tokens live in `app/app.css`; there is no
  `tailwind.config`.
- All commerce data (products, collections, cart, checkout, account, orders)
  comes from **Nevios** at runtime, via the SDK `@nevios/storefront-js` and the
  React kit `@nevios/storefront-kit`. The live store = *this code* + *the
  merchant's Nevios catalog*.

## The golden distinction — code vs content

- **Content** = products, prices, images, collections, stock, discounts. Lives
  in the **Nevios dashboard / MCP**, arrives through the SDK at runtime.
  **Never hardcode catalog data in this repo — not even placeholders.**
- **Code** = layout, sections, design, page-shell copy (hero slides, FAQ,
  content pages). Lives here. This is what you edit.

"Change the price of X" / "add a product" → dashboard content, not code — say
so. "Add a testimonials section" / "make the hero say Y" → code, do it here.

## The map

```
app/root.tsx                     <html> shell, kit providers, fonts, Header/Footer mount
app/app.css                      ALL design tokens — THE rebrand lever
app/design/registry.ts           the /design registry (single source of truth)
app/design/design-shell.tsx      DesignShell, Specimen, PropsTable, RuleBox
app/components/
  Header.tsx / Footer.tsx        site chrome
  sections/                      hero-carousel, product-rail, category-pills, usp-bar,
                                 testimonials, media-text, newsletter, faq
  product/                       vertical-card, product-gallery, variant-selector,
                                 stock-pill, add-to-cart-button
  shared/                        media-image, pagination, eyebrow, content-page
  ui/                            shadcn primitives (button, input, dialog, sheet, …)
app/routes/
  _index.tsx                     home — a flat list of <section>s
  products.$handle.tsx           product detail (PDP)
  collections._index.tsx / collections.$handle.tsx
  search.tsx · cart.tsx · checkout.tsx · account.tsx · account_.verify.tsx
  order.$token.tsx               public order-status page (token = auth)
  o-nas / doprava / kontakt / obchodni-podminky   content pages (ContentPage shell)
  sitemap[.]xml.tsx · robots[.]txt.tsx            SEO resource routes
  design.*.tsx                   live specimen pages for the registry
app/lib/                         SDK wiring, market resolution, adapters (mostly off-limits)
nevios.config.ts                 store name, markets, kit theme fallback
nevios.routes.json               route-sync manifest (titles/SEO for content pages)
.github/workflows/nevios-deploy.yml   push → build → nevios push → nevios routes sync
```

## /design is the registry

`/design` (live at that URL in dev) is the store's component catalog —
generated from `app/design/registry.ts`, never from a markdown list. **Before
building any UI, check `/design` and `registry.ts` for an existing section or
primitive that already does it.** Reuse beats rebuilding, always.

Definition of done for a NEW component/section:
1. Build it under the right folder: `components/{sections,product,shared,ui}/`.
2. Add an entry to `app/design/registry.ts` (group + slug + title + description).
3. Add a specimen route `app/routes/design.<group>.<slug>.tsx` — copy an
   existing one (`design.sections.usp-bar.tsx` is a good model): `DesignShell` +
   `Specimen` with real demo props + `PropsTable`.
4. `pnpm typecheck` passes.

Skip a step and the component doesn't exist as far as the design system knows.

## Recipes (common tasks)

- **Change hero copy / slides** → `app/routes/_index.tsx`, the `HeroCarousel`
  `slides` array (`eyebrow`, `title`, `description`, `ctaLabel`, `ctaHref`, `tone`).
- **Add / reorder / remove a home section** → `app/routes/_index.tsx` is a flat
  list of `<section>` blocks. Move, delete, or drop in another registered
  section with props. Wrap in `<section className="section-wide">` like its
  neighbors (hero is intentionally edge-to-edge).
- **Add a NEW section type** → follow the /design definition-of-done above,
  then compose it into `_index.tsx`. Props in, markup out — no fetching inside
  sections; data comes from the route loader.
- **Rebrand** → edit tokens in `app/app.css` (the brand ramp feeding `--brand`,
  `--brand-hover`, `--brand-soft`, `--brand-accent`, surfaces, gradients,
  fonts) **and** the `theme` in `nevios.config.ts` — the kit's checkout /
  account / order surfaces read the config theme, so keep the two visually in
  sync. Never restyle components one by one.
- **Change the product card look** → `app/components/product/vertical-card.tsx`
  (specimen: `/design/product/vertical-card`). Keep the framed convention:
  outer frame `bg-paper-cream-soft`, image well `bg-paper-cream`.
- **Add a content page** → new route file under `app/routes/` using the
  `ContentPage` shell (copy `o-nas.tsx`). It auto-registers into the Nevios
  route registry via `nevios routes sync` on deploy (feeds sitemap + dashboard
  page list); add a `"/your-path": { "title": "…" }` entry in
  `nevios.routes.json` for a proper title/SEO metadata. To make it reachable,
  add it to the top menu (below) or the Footer's info column.
- **Edit the top menu** → `shop.menu` in `nevios.config.ts` — ONE list of
  `{ label, href }`, rendered by both the desktop header nav and the mobile
  menu drawer. Never hardcode nav links in `Header.tsx`/`menu-drawer.tsx`.
- **Add a shadcn primitive** → `pnpm dlx shadcn@latest add <name>` (config in
  `components.json`; lands in `app/components/ui/`). It's covered by the
  `/design/primitives/overview` specimen — extend that page if it's a primitive
  shoppers will see.
- **Add a product-page element** (size guide, delivery estimate, …) → build
  under `app/components/product/`, register + add it to the
  `design.product.pdp-elements.tsx` specimen, compose into
  `app/routes/products.$handle.tsx`.

## Rules (hard)

- **Tokens only.** No hex, rgb, or arbitrary colors in components — use the
  utilities from `app/app.css` (`bg-brand`, `text-fg-2`, `bg-paper-cream`,
  `rounded-pill`, `duration-base`, `section-wide`, …). To change a color,
  change the token.
- **Hairlines via `ring-*` / `.ring-hairline`, never Tailwind `border-*`.**
- **`.num` on every figure** (prices, quantities, counts) — tabular numerals.
- **Icons are lucide-react. No emoji in UI.**
- **`MediaImage` for ALL catalog/media images** — never a bare `<img>`. It
  handles empty `src` (neutral placeholder) and CDN resizing.
- **Images live in Nevios Media**, referenced by their CDN URL. Never commit
  images to `/public`, never hotlink third-party URLs.
- **Commerce IDs are strings.** They're Snowflake-sized — `Number(id)` corrupts
  them. Never coerce.
- **Money is in minor units** (`amount_cents`). Divide by 100 for display, or
  better: use the kit's `PriceMoney` / the `productToRailItem` adapter.
- **Every section must render gracefully with empty data** — no photo, zero
  products, missing description. Empty ≠ broken.

## Off-limits (never touch unless explicitly asked)

- SDK wiring: `app/lib/nevios.server.ts`, `app/lib/nevios.browser.ts`,
  `app/lib/storefront.server.ts` (multi-tenant store resolution).
- Checkout / account / order **kit internals** — `CheckoutFlow`,
  `AccountDashboard`, `OrderStatusPage` and friends are rented from
  `@nevios/storefront-kit` and correctness-critical. The page *shells* in
  `checkout.tsx` / `account.tsx` / `order.$token.tsx` are yours; the flows are not.
- `.github/workflows/*` — the deploy pipeline.
- `nevios.routes.json` **schema** (`app`, `source`, `patterns`, `exclude`) —
  adding/editing entries under `routes` is fine.
- Secrets: `.env*`, `.dev.vars`, tokens. Never read into a commit, never print.
- `package.json` dependencies — don't add or bump packages.

## Skills (owner shortcuts)

- **`/develop`** — starts the local live preview and orients the owner on how to
  work on the site. The *working* mode; never publishes.
- **`/deploy`** — runs the safety gate (`typecheck && build`) and, only if green,
  commits + pushes to `main` to publish live. The *publish* step.
- **`/exploration <target> <what to vary> [N]`** — builds a throwaway
  `/design/exploration` page with N side-by-side variants of one component
  (default 5) to compare and pick; applies the winner and deletes the page.

## Run / verify / deploy

- **Dev**: `pnpm dev` → http://localhost:3030 (and `/design` for the registry).
- **Safety gate before every push**: `pnpm typecheck && pnpm build`. If both
  pass, the deploy will too.
- **Deploy is automatic**: commit + push to `main`. GitHub Actions builds and
  runs `nevios push`, then `nevios routes sync` (reads `nevios.routes.json`).
  A failed build never touches the live store.
- **Preview without going live**: `pnpm build`, then
  `npx @nevios/cli preview --dir ./build/server` → a `*-preview` URL; the live
  store keeps serving.
