import * as React from "react";
import {
  Banknote,
  ChevronLeft,
  CreditCard,
  HandCoins,
  Landmark,
  Loader2,
  Lock,
  ShieldOff,
} from "lucide-react";
import type { PaymentCategory, PaymentMethod } from "@nevios/storefront-js";
import { formatCents, useCheckout } from "@nevios/storefront-kit";

import { Button } from "~/components/ui/button";

import { OptionCard, OptionCardSkeleton } from "./option-card";

const CATEGORY_ICON: Record<PaymentCategory, React.ComponentType<{ className?: string }>> = {
  gateway: CreditCard,
  bank: Landmark,
  cod: HandCoins,
  manual: Banknote,
};

/**
 * Step 3 — Platba. Mirrors the kit PaymentSection's correctness-critical flow:
 * pick a method (`setPaymentMethod` folds the surcharge into totals), then
 * `pay()` — gateway methods start the payment and the provider redirects the
 * browser to `redirect_url`; cod/bank/manual complete directly and the placed
 * checkout (with `order_status_token`) is handled by the route.
 */
export function PaymentStep({
  onBack,
  locale,
}: {
  onBack: () => void;
  locale?: string;
}) {
  const { checkout, paymentMethods, setPaymentMethod, pay } = useCheckout();
  const [methods, setMethods] = React.useState<PaymentMethod[] | null>(null);
  const [fetching, setFetching] = React.useState(true);
  const [failed, setFailed] = React.useState(false);
  const [localSelected, setLocalSelected] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);
  const [redirecting, setRedirecting] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  const selected = localSelected ?? checkout?.payment_method ?? null;

  const choose = React.useCallback(
    async (method: string, prev: string | null) => {
      setLocalSelected(method);
      setSaving(true);
      try {
        await setPaymentMethod(method);
      } catch {
        setLocalSelected(prev); // revert; the page banner shows the error
      } finally {
        setSaving(false);
      }
    },
    [setPaymentMethod],
  );

  React.useEffect(() => {
    let live = true;
    setFetching(true);
    setFailed(false);
    paymentMethods()
      .then((ms) => {
        if (!live) return;
        setMethods(ms);
        // Auto-select if the merchant offers exactly one method (kit parity).
        if (ms.length === 1 && checkout?.payment_method == null) {
          void choose(ms[0].method, null);
        }
      })
      .catch(() => {
        if (!live) return;
        setMethods([]);
        setFailed(true);
      })
      .finally(() => live && setFetching(false));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const selectedMethod = methods?.find((m) => m.method === selected) ?? null;
  const isGateway = selectedMethod?.requires_redirect ?? false;
  const busy = placing || redirecting;

  async function placeOrder() {
    if (!selectedMethod || busy || saving) return;
    setPlacing(true);
    try {
      const base = typeof window !== "undefined" ? window.location.origin : "";
      // Gateway → startPayment + browser redirect (done by the provider);
      // returning lands back on /checkout, where phase=success resumes to the
      // order page. Direct (cod/bank/manual) → complete() → the placed
      // checkout carries order_status_token and the route navigates.
      const result = await pay({
        returnUrl: `${base}/checkout`,
        cancelUrl: `${base}/checkout`,
      });
      if (result.kind === "redirect") {
        setRedirecting(true); // browser is leaving — keep the button busy
        return;
      }
      // kind === "order" → route-level effect handles cart clear + navigation.
    } catch {
      setPlacing(false); // error → page banner; let the customer retry
      return;
    }
    // Keep `placing` on success — this view is about to unmount.
  }

  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-inset ring-[var(--hairline)] sm:p-6">
      <h2 className="text-lg font-bold text-fg-1">Platba</h2>
      <p className="mt-1 text-sm text-fg-3">Vyberte, jak chcete objednávku zaplatit.</p>

      <div className="mt-5">
        {fetching && !methods?.length ? (
          <div className="space-y-2.5" aria-hidden>
            <OptionCardSkeleton />
            <OptionCardSkeleton />
          </div>
        ) : failed ? (
          <PaymentEmpty
            text="Platební metody se nepodařilo načíst."
            action={
              <Button variant="outline" size="sm" onClick={() => setReloadKey((k) => k + 1)}>
                Zkusit znovu
              </Button>
            }
          />
        ) : !methods || methods.length === 0 ? (
          <PaymentEmpty text="Pro tento trh není dostupná žádná platební metoda." />
        ) : (
          <div role="radiogroup" aria-label="Platební metoda" className="space-y-2.5">
            {methods.map((m) => {
              const Icon = CATEGORY_ICON[m.category] ?? Banknote;
              return (
                <OptionCard
                  key={m.method}
                  selected={selected === m.method}
                  onSelect={() => {
                    if (selected !== m.method && !saving && !busy) void choose(m.method, selected);
                  }}
                  trailing={
                    m.surcharge_cents > 0 && checkout ? (
                      <span className="num text-sm font-semibold text-fg-2">
                        +{" "}
                        {formatCents(m.surcharge_cents, checkout.totals.currency, locale)}
                      </span>
                    ) : undefined
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-paper-cream text-fg-2">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-semibold text-fg-1">{m.display_label}</span>
                      {m.display_description ? (
                        <span className="text-xs text-fg-3">{m.display_description}</span>
                      ) : null}
                    </span>
                  </span>
                </OptionCard>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!selectedMethod || busy || saving}
          onClick={() => void placeOrder()}
        >
          {busy ? <Loader2 aria-hidden className="animate-spin" /> : <Lock aria-hidden />}
          {redirecting
            ? "Přesměrováváme na bránu…"
            : isGateway
              ? "Zaplatit a objednat"
              : "Dokončit objednávku"}
        </Button>
        {isGateway ? (
          <p className="text-center text-xs text-fg-3">
            Budete přesměrováni na zabezpečenou platební bránu.
          </p>
        ) : null}
        <div className="flex justify-center sm:justify-start">
          <Button type="button" variant="ghost" onClick={onBack} disabled={busy} className="text-fg-2">
            <ChevronLeft aria-hidden />
            Zpět na dopravu
          </Button>
        </div>
      </div>
    </div>
  );
}

function PaymentEmpty({ text, action }: { text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-paper-cream-soft px-6 py-10 text-center">
      <ShieldOff aria-hidden className="size-6 text-fg-3" strokeWidth={1.5} />
      <p className="text-sm text-fg-2">{text}</p>
      {action}
    </div>
  );
}
