import { data } from "react-router";
import { OrderStatusPage } from "@nevios/storefront-kit";
import { StorefrontError } from "@nevios/storefront-js";

import type { Route } from "./+types/order.$token";
import { getServerClient } from "../lib/nevios.server";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

export function meta({ data: d }: Route.MetaArgs) {
  return [{ title: d?.order ? `Order ${d.order.order_number} · ${shop.name}` : shop.name }];
}

// Order status is keyed by the public status token (the capability). SSR'd so
// the page is shareable + crawlable; the token IS the auth (no login).
export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { client } = await getServerClient(request, context.cloudflare.env);
  try {
    const order = await client.order.byStatusToken(params.token);
    return { order };
  } catch (err) {
    if (err instanceof StorefrontError && err.code === "not_found") {
      throw data("Order not found", { status: 404 });
    }
    throw err;
  }
}

// Full status page (timeline + items + shipping + tracking) — the kit's; this
// route owns only the page shell.
export default function OrderRoute({ loaderData }: Route.ComponentProps) {
  const { locale } = useMarketData();
  return (
    <div className="section-prose py-8 lg:py-12">
      <OrderStatusPage order={loaderData.order} locale={locale} />
    </div>
  );
}
