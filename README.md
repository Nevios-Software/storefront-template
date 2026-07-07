# Your Nevios store

This is your online store's frontend — a React (React Router 7) app that
Nevios hosts on Cloudflare. Products, prices, and orders live in your Nevios
dashboard; this repo is only the design and layout. The easiest way to change
it: open the repo in Claude (desktop or mobile) and say what you want.

## Quickstart (local)

```sh
pnpm install
cp .env.example .dev.vars   # then fill in your publishable key
pnpm dev                    # → http://localhost:3030
```

Visit `/design` in dev — the live catalog of every section, product component,
and primitive this store is built from.

## How deploys work

Push to `main`. GitHub Actions
([`.github/workflows/nevios-deploy.yml`](./.github/workflows/nevios-deploy.yml))
builds the app, ships it with `nevios push`, and syncs your pages into the
Nevios route registry (`nevios routes sync`). A failed build never touches the
live store.

Required repo settings (Settings → Secrets and variables → Actions) — set for
you when Nevios creates the repo:

| Kind | Name | Value |
|---|---|---|
| Secret | `NEVIOS_PAT` | your Nevios deploy token |
| Variable | `NEVIOS_API_URL` | `https://c.nevios.io` |
| Variable | `NEVIOS_ACCOUNT` | your account handle |
| Variable | `NEVIOS_STORE` | your store handle |

## Editing with AI

[`CLAUDE.md`](./CLAUDE.md) is the full edit-guide — the map of the codebase,
recipes for common changes (hero copy, new sections, rebrand, content pages),
and the hard rules. Claude reads it automatically; humans are welcome too.

## What's content vs. code

- **Content** (products, prices, images, collections, stock) → your **Nevios
  dashboard**. It arrives at runtime — it is never hardcoded here.
- **Code** (layout, sections, design, page copy) → this repo.

---

> Generated from the Nevios storefront template. Built on the published
> `@nevios/storefront-js` + `@nevios/storefront-kit` packages.
