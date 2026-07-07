import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import {
  NeviosProvider,
  ThemeProvider,
  CartProvider,
  AccountProvider,
  I18nProvider,
  useT,
  themeToCssVars,
  type StorefrontTheme,
} from "@nevios/storefront-kit";

import type { Route } from "./+types/root";
import { getBrowserClient } from "./lib/nevios.browser";
import {
  resolveMarketFromRequest,
  buildHreflangAlternates,
  type HreflangAlternate,
} from "./lib/market";
import { resolveStore } from "./lib/storefront.server";
import { shop, theme, defaultLocale } from "../nevios.config";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import "./app.css";

/** Multi-tenant: resolve which store this request is for (by Host → publishable
 *  key + per-store theme), falling back to the build-time config (single-tenant
 *  / local dev). The browser gets the resolved publishable config (it's safe). */
export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const url = new URL(request.url);
  const store = await resolveStore(request, env);
  // Per-store tokens override the config defaults; config theme is the fallback.
  const effectiveTheme: StorefrontTheme = store.theme
    ? { ...theme, ...(store.theme as Partial<StorefrontTheme>) }
    : theme;

  if (store.multiTenant) {
    const locale = store.locale ?? defaultLocale;
    return {
      config: {
        publishableKey: store.publishableKey,
        apiUrl: env.NEVIOS_API_URL,
        // empty market → SDK omits X-Market → backend resolves the account default
        market: store.market ?? "",
        locale,
      },
      theme: effectiveTheme,
      name: store.name ?? shop.name,
      market: store.market ?? null,
      locale,
      pathPrefix: "",
      strategy: "cookie" as const,
      markets: [],
      alternates: [] as HreflangAlternate[],
      canonical: url.origin + url.pathname,
      preview: store.preview,
    };
  }

  // Single-tenant fallback — build-time config markets + hreflang.
  const m = resolveMarketFromRequest(request);
  return {
    config: {
      publishableKey: store.publishableKey,
      apiUrl: env.NEVIOS_API_URL,
      market: m.handle,
      locale: m.locale,
    },
    theme: effectiveTheme,
    name: shop.name,
    market: m.handle,
    locale: m.locale,
    pathPrefix: m.pathPrefix,
    strategy: shop.strategy,
    markets: Object.values(shop.markets),
    alternates: buildHreflangAlternates(url, m),
    canonical: url.origin + url.pathname,
    preview: false,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  // Read unconditionally so the document is right even on error renders.
  const root = useRouteLoaderData("root") as
    | {
        locale?: string;
        alternates?: HreflangAlternate[];
        canonical?: string;
        theme?: StorefrontTheme;
      }
    | undefined;
  const lang = root?.locale ?? defaultLocale;
  const alternates = root?.alternates ?? [];
  const themeVars = root?.theme ?? theme;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Default storefront fonts — Satoshi + Pilcrow Rounded (Fontshare). Swap
            the family names here + in app.css --font-satoshi/--font-pilcrow to rebrand. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901&f[]=pilcrow-rounded@400,500,700,900&display=swap"
        />
        {root?.canonical ? <link rel="canonical" href={root.canonical} /> : null}
        {alternates.map((a) => (
          <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
        ))}
        <Meta />
        <Links />
      </head>
      <body
        className="flex min-h-full flex-col bg-page font-sans text-fg-1 antialiased"
        style={themeToCssVars(themeVars) as React.CSSProperties}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const client = React.useMemo(
    () => getBrowserClient(loaderData.config),
    [loaderData.config],
  );

  return (
    <ThemeProvider theme={loaderData.theme}>
      <I18nProvider locale={loaderData.locale}>
        <NeviosProvider client={client}>
          <AccountProvider>
            <CartProvider>
              {loaderData.preview ? <PreviewBanner /> : null}
              <div className="flex min-h-dvh flex-col">
                <Header />
                <main className="flex-1">
                  <Outlet />
                </main>
                <Footer />
              </div>
            </CartProvider>
          </AccountProvider>
        </NeviosProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

/** Sticky banner shown when viewing an unpublished draft via ?nevios_preview=…. */
function PreviewBanner() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0.5rem 1rem",
        textAlign: "center",
        fontSize: "0.85rem",
        fontWeight: 500,
        background: "var(--nv-brand)",
        color: "var(--nv-brand-foreground)",
      }}
    >
      Preview — unpublished draft theme. Publish from your dashboard to go live.
    </div>
  );
}

/** Branded, localized error page — out-of-market URLs 404 by design, so this is
 *  a guaranteed surface. Rendered inside <Layout> (themed body), but outside the
 *  app providers, so it mounts its own I18nProvider for localized copy. */
export function ErrorBoundary() {
  const error = useRouteError();
  const root = useRouteLoaderData("root") as { locale?: string } | undefined;
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <ThemeProvider theme={theme}>
      <I18nProvider locale={root?.locale ?? defaultLocale}>
        <ErrorView notFound={notFound} />
      </I18nProvider>
    </ThemeProvider>
  );
}

function ErrorView({ notFound }: { notFound: boolean }) {
  const t = useT();
  const key = notFound ? "error.notFound" : "error.generic";
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "var(--nv-font)",
        color: "var(--nv-fg)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>{t(`${key}.title`)}</h1>
      <p style={{ margin: 0, color: "var(--nv-muted)" }}>{t(`${key}.body`)}</p>
      <a
        href="/"
        style={{
          marginTop: "0.5rem",
          padding: "0.6rem 1.3rem",
          borderRadius: "var(--nv-radius)",
          background: "var(--nv-brand)",
          color: "var(--nv-brand-foreground)",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        {t("error.home")}
      </a>
    </main>
  );
}
