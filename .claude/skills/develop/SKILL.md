---
name: develop
description: Start a local live preview of this store and orient the owner on how to work on their site. Invoke when the user wants to start working / editing / making changes to the website (e.g. "/develop", "pojďme pracovat na webu", "chci upravit web").
---

# Develop — start working on the store

Goal: get the store running locally so the owner **sees their site update as we
edit**, and make clear how working on it works. This is the *working* mode — it
never publishes. Publishing is a separate step (`/deploy`).

Speak to the owner in their language, warmly and **without dev jargon** — they
run a shop, they don't need to know about builds or ports.

## Steps

1. **Start the live preview.** Run the dev server in the background:
   `pnpm dev`. It serves the site at **http://localhost:3030**. If a server is
   already running on that port, reuse it — don't start a second one.
2. **Wait until it responds**, then tell the owner their site is live locally at
   that address and that **every change we make shows up instantly** — no
   waiting, no publishing yet.
3. **Orient them in one short paragraph:**
   - "Just tell me what you want to change, in your own words — a new hero
     headline, reorder the homepage, a different colour, a new page… I'll do it
     and you'll see it right away."
   - The **design catalog** lives at **http://localhost:3030/design** — every
     section, product card, and building block the store ships with. Good to
     point at when they ask "what can we put here?".
4. **Know the code ↔ content line** (say which side a request is on):
   - **Code (I edit here):** layout, sections, design, colours/fonts, page copy
     (hero slides, content pages like About / Shipping).
   - **Content (the Nevios dashboard, not code):** products, prices, images,
     collections, stock, discounts. If they ask to change one of these, tell
     them it's done in the dashboard, not here.
5. **Do not push or deploy anything.** When they're happy with how it looks,
   `/deploy` is what publishes it live.
