import * as React from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMagicLinkVerify, useT } from "@nevios/storefront-kit";

import type { Route } from "./+types/account_.verify";
import { shop } from "../../nevios.config";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Signing in · ${shop.name}` }];
}

// Magic-link callback: ?token=… → verify → land in the account. The trailing
// underscore in the filename keeps this OUT of the /account layout.
export default function VerifyRoute() {
  const t = useT();
  const [params] = useSearchParams();
  const token = params.get("token");
  const { status } = useMagicLinkVerify(token);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (status === "success") navigate("/account", { replace: true });
  }, [status, navigate]);

  return (
    <p style={{ color: "var(--nv-muted)" }}>
      {status === "error" ? t("account.verifyError") : t("account.verifying")}
    </p>
  );
}
