import { useAccount, LoginForm, AccountDashboard, ProfileEditor, OrderHistory, AddressBook } from "@nevios/storefront-kit";

import type { Route } from "./+types/account";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Account · ${shop.name}` }];
}

// Account state is per-shopper + client-side; never cached.
export default function AccountRoute() {
  const { signedIn, loading } = useAccount();
  const { locale } = useMarketData();

  return (
    <div style={{ maxWidth: "40rem" }}>
      {loading ? null : signedIn ? (
        <AccountDashboard>
          <ProfileEditor />
          <OrderHistory locale={locale} cartHref="/cart" />
          <AddressBook />
        </AccountDashboard>
      ) : (
        <LoginForm verifyPath="/account/verify" />
      )}
    </div>
  );
}
