import { useAccount, LoginForm, AccountDashboard, ProfileEditor, OrderHistory, AddressBook } from "@nevios/storefront-kit";

import type { Route } from "./+types/account";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Můj účet · ${shop.name}` }];
}

// Account state is per-shopper + client-side; never cached. The auth flow +
// dashboard internals are the kit's; this route owns only the page shell.
export default function AccountRoute() {
  const { signedIn, loading } = useAccount();
  const { locale } = useMarketData();

  return (
    <div className="section-prose py-8 lg:py-12">
      <h1 className="mb-6 text-3xl font-bold text-fg-1 sm:text-4xl">
        {signedIn ? "Můj účet" : "Přihlášení"}
      </h1>
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
