#!/usr/bin/env node
/**
 * Deploy gate — the can't-ship-broken loop:
 *
 *   build → upload a PREVIEW version → smoke the preview → promote to
 *   production ONLY if the smoke is green.
 *
 * A broken edit (yours or Claude's) never reaches a shopper: the preview serves
 * the new code at a throwaway URL, the smoke exercises it, and production is
 * promoted only on success. If the smoke fails, production is untouched.
 *
 *   npm run deploy            # gated (this script)
 *   npm run deploy:direct     # ungated escape hatch (build && wrangler deploy)
 *   npm run rollback          # revert production to the previous version
 *
 * Requires an authenticated wrangler (`npx wrangler login`) and wrangler ≥ 3.40
 * (the `versions` flow). Promote uses the parsed version id from the upload.
 */

import { execFileSync } from "node:child_process";

function run(cmd, args, { capture = false } = {}) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  return execFileSync(cmd, args, {
    stdio: capture ? ["inherit", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
  });
}

// 1. Build (the RR build typechecks the route graph).
run("npx", ["react-router", "build"]);

// 2. Upload a preview version — uploaded but NOT serving production traffic yet.
const out = run("npx", ["wrangler", "versions", "upload"], { capture: true });
process.stdout.write(out);

const idMatch = out.match(/Version ID:\s*([0-9a-fA-F-]{8,})/);
const urlMatch = out.match(/(https:\/\/\S*workers\.dev\S*)/);
if (!idMatch) {
  console.error("\n✗ could not parse the uploaded version id from wrangler output — aborting.");
  process.exit(1);
}
const versionId = idMatch[1];
const previewUrl = urlMatch && urlMatch[1];

// 3. Smoke the preview BEFORE it can serve a shopper.
if (!previewUrl) {
  console.error("\n✗ no preview URL in wrangler output — refusing to promote blind.");
  process.exit(1);
}
console.log(`\n▶ smoking the preview before promoting: ${previewUrl}`);
run("node", ["scripts/smoke.mjs", previewUrl]);

// 4. Green → promote this exact version to 100% of production.
run("npx", ["wrangler", "versions", "deploy", `${versionId}@100%`, "--yes"]);
console.log("\n✓ promoted to production after a green smoke. Use `npm run rollback` to revert.");
