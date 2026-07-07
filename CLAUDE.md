# Your Nevios store — agent guide

This repo is your online store's **frontend code**. It's a React app that Nevios
hosts. You (Claude) edit this code; when you push to `main`, GitHub builds it and
deploys it to Nevios automatically. This guide tells you how to change the store
safely.

## What this is

- A **React Router 7** app (SSR) that renders on **Cloudflare Workers**.
- Styling is **Tailwind v4** (CSS-first — tokens live in `app/app.css`, there is
  no `tailwind.config`).
- Product/collection/cart/checkout **data comes from Nevios** via the SDK
  `@nevios/storefront-js` and the React kit `@nevios/storefront-kit` — you do NOT
  hardcode products. The store you see is *this code* + *your Nevios catalog*.

## The golden distinction — code vs content

- **Content** (products, prices, images, collections, stock) is managed in the
  **Nevios dashboard**, not here. It arrives at runtime through the SDK. Never
  paste product data into this repo.
- **Code** (layout, sections, design, copy in the page shells) lives here. That's
  what you edit.

If someone asks you to "change the price of X" or "add a product" — that's
dashboard content, not code. Say so. If they ask to "add a testimonials section"
or "make the hero say Y" — that's code, do it here.

## How data flows (don't fight it)

- Loaders fetch from Nevios: `getServerClient(request, env)` →
  `client.catalog.products(...)`, `client.catalog.collection(handle)`, etc.
  (`app/lib/nevios.server.ts`).
- Money is in **minor units** (`amount_cents`) — divide by 100 for display, or
  use the kit `PriceMoney` / `productToRailItem` adapter.
- Commerce **IDs are big numbers — keep them strings**, never `Number(id)`.
- Cart/account state comes from kit hooks: `useCart`, `useAccount`, `useT`,
  `CartDrawer` — don't roll your own store.

## Where things live

```
app/root.tsx                 <html> shell, providers, fonts, header/footer mount
app/app.css                  design tokens (brand color, fonts, surfaces, radii)
app/components/Header.tsx     site header
app/components/Footer.tsx     site footer
app/components/sections/*     home-page sections (hero-carousel, product-rail, category-pills)
app/components/product/*      product card(s)
app/routes/_index.tsx         home page (composes the sections)
app/routes/collections.$handle.tsx   category / listing page
app/routes/products.$handle.tsx      product detail page
app/routes/{cart,checkout,account}.tsx
app/lib/*                     data clients, market resolution, helpers
nevios.config.ts             store name, markets, theme fallback
```

## Common tasks (how to actually do them)

- **Change hero text / slides** → `app/routes/_index.tsx`, the `HeroCarousel`
  `slides` array. Each slide = `{ eyebrow, title, description, ctaLabel, ctaHref, tone }`.
- **Reorder / add / remove a home section** → `app/routes/_index.tsx` — it's a
  plain list of `<section>`s. Add a new component under `app/components/sections/`
  and drop it in.
- **Restyle the store's brand color / fonts** → `app/app.css` design tokens
  (e.g. `--brand`, `--coral`, font families). Change the token, not every class.
- **Change the product card look** → `app/components/product/vertical-card.tsx`.
- **Edit a content page** (about, shipping…) → the matching route under
  `app/routes/`.

Match the surrounding code: reuse existing Tailwind token classes
(`bg-card`, `text-fg-1`, `text-coral`, `rounded-pill`, `section-wide`, …) — they're
defined in `app/app.css`. Don't invent hex colors.

## Run / build / deploy

- Dev: `pnpm dev` (or `npm run dev`) → local at the printed URL.
- Build: `pnpm build` → `build/server` (isolate) + `build/client` (assets).
- **Deploy is automatic:** commit + push to `main`. GitHub Actions
  (`.github/workflows/nevios-deploy.yml`) builds and runs `nevios push`. If the
  build fails, the live store is untouched.
- To preview a change without going live, deploy to the preview slot:
  `npx @nevios/cli preview --dir ./build/server` → a `*-preview` URL; the live
  store keeps serving.

## Rules

- **Never** commit secrets or `.env`. The deploy token lives in GitHub Actions
  secrets (`NEVIOS_PAT`), never in code.
- **Never** hardcode catalog data — read it from the SDK.
- Keep commerce IDs as strings; money in minor units.
- Prefer editing a design **token** in `app/app.css` over restyling many
  components by hand.
- After a code change, a quick `pnpm build` locally catches most breakage before
  you push.
