---
name: exploration
description: Spin up a throwaway page that renders N side-by-side variants of ONE section/component — varying a single property (background, radius, image ratio, padding, layout, badge tone…) — so the owner can compare and pick. Default 5 variants. Invoke for "/exploration <target> <what to vary> [N variant]" (e.g. "/exploration bg produktové karty - 5 variant", "/exploration hero radius").
---

# Exploration — compare variants of a component

Goal: let the owner **see options side by side and pick one**. Build a
*temporary* page that renders the target component N times, each with a
different value of ONE property, clearly labeled. Once they pick, apply the
winner to the real component and **delete the exploration page**. It never ships.

Speak to the owner in their language, plainly — show them choices, not code.

## 1 · Parse the request

Work out three things from the argument:
- **Target** — which section/component. Find the **real file**, don't guess
  (e.g. product card → `app/components/product/vertical-card.tsx`, rendered by
  the rail; hero → `app/components/sections/hero-carousel.tsx`). Check how it's
  used so the variants render like the live site.
- **Property to vary** — the single dimension (background, radius, image ratio,
  padding, layout, size, badge tone…).
- **Count N** — **default 5** unless the request says otherwise ("3 varianty",
  "8 variant" → use that).

If the target or property is ambiguous, pick the most reasonable reading, say
which you chose, and proceed — don't stall.

## 2 · Build the throwaway page

1. **Choose N sensible candidate values.** Prefer tokens from `app/app.css`
   first (e.g. surfaces `paper-cream-soft` / `paper-cream` / `paper-peach` /
   `paper-rose`; radii; motion), then add 1–2 hand-tuned values if more range
   helps. Each variant shows a **label + its value** above it.
2. **Create the route `app/routes/design.exploration.tsx`** (served at
   **`/design/exploration`**). `/design` is already on the `nevios.routes.json`
   exclude list, so even if this file survives by accident it never reaches the
   sitemap or the dashboard page list.
3. Render the target **N times in a labeled grid** — everything identical except
   the one varied property, so the comparison is clean. Box each with a heading
   (`Varianta 1 — paper-peach`, `Varianta 2 — paper-cream` …).
4. **Use representative data** so it looks real. If the component needs catalog
   data (a product card), load a few real products in the route loader — copy
   the pattern from `app/routes/_index.tsx`. This page is dev-only and thrown
   away, so it's exempt from the "no hardcoded catalog" rule, but a real loader
   is still nicer.
5. `pnpm typecheck` to be safe.

## 3 · Show it

6. Ensure the dev preview is running (`pnpm dev` → :3030), open
   **http://localhost:3030/design/exploration**, screenshot it, and present the
   N options with their labels. Ask which one wins.

## 4 · After they pick

7. Apply the chosen value to the **real** component / usage (e.g. `imageBg` in
   the rail, or the token in `app.css`) and verify it on the live-ish page.
8. **Delete `app/routes/design.exploration.tsx`.** The exploration page is
   never committed and never deployed.

## Guardrails

- **One property at a time** — that's the whole point (a clean comparison).
- **Always delete** the exploration route once a choice is made; it must never
  reach `/deploy`.
- **Never register it** in the `/design` registry (`app/design/registry.ts`) —
  it's throwaway, not a catalog entry.
