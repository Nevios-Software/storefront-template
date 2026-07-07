# Your Nevios store

This is your online store's frontend — a React (React Router 7) app that Nevios
hosts on Cloudflare. You edit it by chatting with Claude; every push to `main`
builds and deploys automatically.

## Editing

- **With Claude** — open this repo in Claude (desktop or the mobile app) and say
  what you want to change. Claude knows this store: see [`CLAUDE.md`](./CLAUDE.md).
- **Locally** — `pnpm install` then `pnpm dev`.

## Deploying

Push to `main`. GitHub Actions ([`.github/workflows/nevios-deploy.yml`](./.github/workflows/nevios-deploy.yml))
builds the app and runs `nevios push`, which ships it to Nevios hosting. A build
failure never touches your live store.

Required repo settings (Settings → Secrets and variables → Actions), set for you
when Nevios creates this repo — or add them yourself:

| Kind | Name | Value |
|---|---|---|
| Secret | `NEVIOS_PAT` | your Nevios deploy token |
| Variable | `NEVIOS_API_URL` | `https://c.nevios.io` |
| Variable | `NEVIOS_ACCOUNT` | your account handle |
| Variable | `NEVIOS_STORE` | your store handle |

## What's data vs. code

- **Content** (products, prices, images, collections) lives in your **Nevios
  dashboard** and arrives at runtime — never hardcode it here.
- **Code** (layout, sections, design) lives in this repo — that's what you edit.

---

> This repo was generated from the Nevios storefront template. It uses the
> published `@nevios/storefront-js` + `@nevios/storefront-kit` packages.
