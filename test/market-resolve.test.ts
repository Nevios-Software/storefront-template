/**
 * Unit tests for the pure market resolver. Run with Node's type-stripping:
 *   node --experimental-strip-types --test test/market-resolve.test.ts
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  pickMarket,
  buildAlternates,
  marketHref,
  readCookie,
  type MarketResolveConfig,
} from "../app/lib/market-resolve.ts";

const MARKETS = {
  cs: { handle: "cs", locale: "cs-CZ", label: "Česko" },
  de: { handle: "de", locale: "de-DE", label: "Deutschland", domain: "shop.de" },
};

const domainCfg: MarketResolveConfig = { strategy: "domain", defaultMarket: "cs", markets: MARKETS };
const pathCfg: MarketResolveConfig = { strategy: "path", defaultMarket: "cs", markets: MARKETS };
const cookieCfg: MarketResolveConfig = { strategy: "cookie", defaultMarket: "cs", markets: MARKETS };

test("domain strategy resolves by host (incl. subdomain), else default", () => {
  assert.deepEqual(pickMarket(domainCfg, { host: "shop.de" }), {
    handle: "de",
    locale: "de-DE",
    pathPrefix: "",
  });
  assert.deepEqual(pickMarket(domainCfg, { host: "www.shop.de:443" }), {
    handle: "de",
    locale: "de-DE",
    pathPrefix: "",
  });
  // Unknown host → default market.
  assert.equal(pickMarket(domainCfg, { host: "example.org" }).handle, "cs");
});

test("path strategy resolves by first segment + reports the prefix", () => {
  assert.deepEqual(pickMarket(pathCfg, { pathname: "/de/products/x" }), {
    handle: "de",
    locale: "de-DE",
    pathPrefix: "/de",
  });
  // No / unknown segment → default, no prefix.
  assert.equal(pickMarket(pathCfg, { pathname: "/products/x" }).handle, "cs");
  assert.equal(pickMarket(pathCfg, { pathname: "/" }).pathPrefix, "");
});

test("cookie is honored only under the cookie strategy", () => {
  assert.equal(pickMarket(cookieCfg, { cookieMarket: "de" }).handle, "de");
  // under domain strategy a stale cookie must NOT override host resolution
  assert.equal(pickMarket(domainCfg, { host: "example.org", cookieMarket: "de" }).handle, "cs");
  assert.equal(pickMarket(domainCfg, { host: "shop.de", cookieMarket: "cs" }).handle, "de");
  // unknown cookie value is ignored → falls through to default
  assert.equal(pickMarket(cookieCfg, { cookieMarket: "xx" }).handle, "cs");
});

test("always falls back to the default market", () => {
  assert.equal(pickMarket(cookieCfg, {}).handle, "cs");
  assert.equal(pickMarket(domainCfg, {}).handle, "cs");
});

test("hreflang alternates: absolute per-domain, with x current path; empty for cookie", () => {
  const url = { origin: "https://shop.de", pathname: "/products/x", search: "" };
  const alts = buildAlternates(domainCfg, url, { handle: "de", locale: "de-DE", pathPrefix: "" });
  const byLang = Object.fromEntries(alts.map((a) => [a.hrefLang, a.href]));
  assert.equal(byLang["de-DE"], "https://shop.de/products/x");
  // cs has no domain → falls back to origin
  assert.ok(byLang["cs-CZ"].endsWith("/products/x"));
  // x-default points at the default market (cs, no domain → origin)
  assert.ok(byLang["x-default"].endsWith("/products/x"));

  // path strategy strips the active prefix before re-prefixing each market
  const palts = buildAlternates(
    pathCfg,
    { origin: "https://x.io", pathname: "/de/products/x", search: "" },
    { handle: "de", locale: "de-DE", pathPrefix: "/de" },
  );
  const pByLang = Object.fromEntries(palts.map((a) => [a.hrefLang, a.href]));
  assert.equal(pByLang["cs-CZ"], "https://x.io/cs/products/x");
  assert.equal(pByLang["de-DE"], "https://x.io/de/products/x");

  // cookie strategy → no alternates
  assert.deepEqual(buildAlternates(cookieCfg, url, { handle: "cs", locale: "cs-CZ", pathPrefix: "" }), []);
});

test("marketHref builds switch URLs per strategy", () => {
  assert.equal(marketHref(domainCfg, MARKETS.de, "/products/x", ""), "https://shop.de/products/x");
  assert.equal(marketHref(pathCfg, MARKETS.de, "/cs/products/x", "/cs"), "/de/products/x");
  assert.equal(marketHref(pathCfg, MARKETS.de, "/cs", "/cs"), "/de");
});

test("readCookie parses a named cookie from the header", () => {
  assert.equal(readCookie("a=1; nv_market=de; b=2", "nv_market"), "de");
  assert.equal(readCookie("a=1", "nv_market"), null);
  assert.equal(readCookie(null, "nv_market"), null);
});
