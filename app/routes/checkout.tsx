import { useNavigate } from "react-router";
import {
  CheckoutProvider,
  CheckoutFlow,
  useCart,
  useStorefront,
} from "@nevios/storefront-kit";

import type { Route } from "./+types/checkout";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Pokladna · ${shop.name}` }];
}

// The checkout FLOW (steps, quotes, payment, place) is the kit's — rented,
// correctness-critical, off-limits. This route owns only the page shell.
export default function CheckoutRoute() {
  const { locale } = useMarketData();
  const { cart } = useCart();
  const client = useStorefront();
  const navigate = useNavigate();

  return (
    <div className="section-prose py-8 lg:py-12">
      <h1 className="mb-6 text-3xl font-bold text-fg-1 sm:text-4xl">Pokladna</h1>
      <CheckoutProvider>
        <CheckoutFlow
          // Create the checkout from the active cart if one isn't in progress.
          cartToken={cart?.token ?? undefined}
          locale={locale}
          onOrderPlaced={(checkout) => {
            // Order placed → empty the cart, go to the status page.
            client.cart.clear();
            if (checkout.order_status_token) {
              navigate(`/order/${checkout.order_status_token}`);
            }
          }}
        />
      </CheckoutProvider>
    </div>
  );
}
