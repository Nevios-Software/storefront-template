#!/usr/bin/env node
/**
 * Buy-flow smoke for a deployed (or local) Nevios storefront — the gate that
 * makes code-as-storefront safe: a wrong edit can't reach shoppers because the
 * deploy promotes only when this passes.
 *
 *   node scripts/smoke.mjs https://your-store.example.com          # render smoke
 *   node scripts/smoke.mjs https://preview-url --commerce          # + cart wiring
 *
 * Default (render smoke, non-mutating): every SSR route returns 200 with no
 * error boundary — catches the dominant AI/edit failure (a broken loader or
 * component). With --commerce: also drives catalog → add-to-cart through the
 * SDK against the live API (proves the commerce wiring; creates a throwaway
 * cart, NOT an order). Exits non-zero on the first failure.
 */

const BASE = (process.argv[2] || process.env.SMOKE_URL || "").replace(/\/+$/, "");
if (!BASE) {
  console.error("usage: node scripts/smoke.mjs <base-url> [--commerce]");
  process.exit(2);
}
const wantCommerce = process.argv.includes("--commerce");

// RR7 renders an ErrorBoundary on a thrown loader/component; the status is also
// non-200. We check both for defense.
const ERROR_MARKERS = [
  "Application Error",
  "Unexpected Server Error",
  "Internal Server Error",
  "loader is not a function",
];

async function getOk(path, { mustContain } = {}) {
  const res = await fetch(BASE + path, {
    headers: { "User-Agent": "nevios-smoke" },
    redirect: "manual",
  });
  const body = await res.text();
  if (res.status !== 200) throw new Error(`${path} → HTTP ${res.status} (expected 200)`);
  for (const m of ERROR_MARKERS) {
    if (body.includes(m)) throw new Error(`${path} → contains error marker "${m}"`);
  }
  if (mustContain && !body.includes(mustContain)) {
    throw new Error(`${path} → missing expected content "${mustContain}"`);
  }
  return body;
}

async function renderSmoke() {
  const home = await getOk("/");
  console.log("  ✓ home renders");
  const m = home.match(/\/products\/([A-Za-z0-9_-]+)/);
  if (m) {
    await getOk(`/products/${m[1]}`);
    console.log(`  ✓ PDP /products/${m[1]} renders`);
  } else {
    console.log("  ⚠ no product link on the homepage — skipping PDP check");
  }
  await getOk("/cart");
  await getOk("/checkout");
  console.log("  ✓ cart + checkout render (200, no error boundary)");
}

async function commerceSmoke() {
  const apiUrl = process.env.NEVIOS_API_URL;
  const key = process.env.NEVIOS_PUBLISHABLE_KEY;
  const market = process.env.NEVIOS_MARKET;
  if (!apiUrl || !key) {
    console.log("  ⚠ NEVIOS_API_URL / NEVIOS_PUBLISHABLE_KEY not set — skipping commerce smoke");
    return;
  }
  const { createStorefrontClient } = await import("@nevios/storefront-js");
  const nevios = createStorefrontClient({ publishableKey: key, apiUrl, market });

  const { products } = await nevios.catalog.products({ limit: 1 });
  if (!products.length) throw new Error("commerce: catalog returned no products");
  const variant = products[0].variants[0];
  if (!variant) throw new Error(`commerce: "${products[0].handle}" has no purchasable variant`);

  const cart = await nevios.cart.addLine({ variant_id: variant.id, quantity: 1 });
  if (cart.totals.item_count < 1) throw new Error("commerce: add-to-cart did not register a line");
  console.log(`  ✓ commerce: catalog + cart (${cart.totals.item_count} item, ${cart.totals.currency})`);
  nevios.cart.clear();
}

async function main() {
  console.log(`▶ smoking ${BASE}`);
  await renderSmoke();
  if (wantCommerce) await commerceSmoke();
  console.log("✓ smoke passed");
}

main().catch((err) => {
  console.error(`\n✗ smoke FAILED: ${err.message}`);
  process.exit(1);
});
