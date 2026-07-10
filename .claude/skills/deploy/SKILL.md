---
name: deploy
description: Safety-check the store and publish it live to Nevios. Invoke when the user wants to deploy / publish / ship / go live with their changes (e.g. "/deploy", "pushni to", "publikuj web", "nasadit").
---

# Deploy — publish the store to Nevios

Goal: publish the current changes to the **live store** (`<your store>.nevios.store`)
— but only if everything is healthy. A broken edit must never reach a shopper.

Publishing this store = **committing and pushing to `main`**. That triggers the
automatic pipeline (GitHub builds it → `nevios push` ships it → `nevios routes
sync` registers pages). **Never** use `pnpm deploy` / wrangler — that is a
leftover escape hatch, not the Nevios path.

Speak to the owner in their language, plainly.

## Steps

1. **Safety gate — must pass before anything ships.** Run:
   `pnpm typecheck && pnpm build`
   If either fails: **STOP, do not commit, do not push.** Show what broke in
   plain language, offer to fix it, and reassure them the live store is
   untouched. A failed build never reaches shoppers.
2. **Commit the pending changes.** Stage everything and commit with a short,
   human message describing what changed (e.g. "New homepage hero + warmer
   product cards"). If there is nothing to commit, tell them it's already up to
   date and stop.
3. **Push to `main`.** This is the publish. Explain that it kicks off the
   automatic deploy.
4. **Confirm and (optionally) watch it land.** Tell them it's publishing now and
   the live site updates in about a minute or two. If they want certainty, watch
   the deploy run to completion (`gh run watch` / `gh run list`), then confirm
   the live store is serving the new version.

## Guardrails

- Never bypass the safety gate. No green build → no push.
- Never touch production directly (no wrangler, no `pnpm deploy`). Only git push.
- Only publish what the owner asked to publish — if there are unrelated staged
  changes, surface them before committing.
