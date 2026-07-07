import * as React from "react";
import { ArrowRight, ChevronLeft, Loader2, MapPin, PackageX } from "lucide-react";
import type { ShippingQuote } from "@nevios/storefront-js";
import { formatCents, useCheckout } from "@nevios/storefront-kit";

import { Button } from "~/components/ui/button";

import { OptionCard, OptionCardSkeleton } from "./option-card";

/**
 * Step 2 — Doprava. Fetches the quotes for the saved address, selecting a row
 * saves it right away (`setShippingMethod`, so the summary totals roll live);
 * „Pokračovat" just advances. Mirrors the kit ShippingPicker's data flow.
 */
export function ShippingStep({
  onDone,
  onBack,
  locale,
}: {
  onDone: () => void;
  onBack: () => void;
  locale?: string;
}) {
  const { checkout, shippingQuotes, setShippingMethod } = useCheckout();
  const [quotes, setQuotes] = React.useState<ShippingQuote[] | null>(null);
  const [fetching, setFetching] = React.useState(true);
  const [failed, setFailed] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null); // rate_id
  const [saving, setSaving] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  const choose = React.useCallback(
    async (q: ShippingQuote, prev: string | null) => {
      setSelected(q.rate_id);
      setSaving(true);
      try {
        await setShippingMethod(q.method_id, q.rate_id);
      } catch {
        setSelected(prev); // server refused → revert; page banner shows why
      } finally {
        setSaving(false);
      }
    },
    [setShippingMethod],
  );

  // Load quotes for the current address; re-load if the address changes.
  const addressKey = checkout?.shipping_address
    ? `${checkout.shipping_address.country_code}:${checkout.shipping_address.postal_code}`
    : null;
  React.useEffect(() => {
    let live = true;
    setFetching(true);
    setFailed(false);
    shippingQuotes()
      .then((qs) => {
        if (!live) return;
        setQuotes(qs);
        // Pre-select the saved method (best-effort match on display name,
        // mirroring the kit); a single offered quote is chosen automatically.
        const savedLabel = checkout?.shipping_method?.rate_display_name;
        const match = savedLabel ? qs.find((q) => q.label === savedLabel) : undefined;
        if (match) {
          setSelected(match.rate_id);
        } else if (qs.length === 1) {
          void choose(qs[0], null);
        } else {
          setSelected(null);
        }
      })
      .catch(() => {
        if (!live) return;
        setQuotes([]);
        setFailed(true);
      })
      .finally(() => live && setFetching(false));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressKey, reloadKey]);

  const canContinue = selected != null && !saving && !fetching;

  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-inset ring-[var(--hairline)] sm:p-6">
      <h2 className="text-lg font-bold text-fg-1">Způsob doručení</h2>
      <p className="mt-1 text-sm text-fg-3">
        Možnosti pro {checkout?.shipping_address?.city ?? "vaši adresu"}
      </p>

      <div className="mt-5">
        {fetching && !quotes?.length ? (
          <div className="space-y-2.5" aria-hidden>
            <OptionCardSkeleton />
            <OptionCardSkeleton />
            <OptionCardSkeleton />
          </div>
        ) : failed ? (
          <EmptyRow
            text="Možnosti doručení se nepodařilo načíst."
            action={
              <Button variant="outline" size="sm" onClick={() => setReloadKey((k) => k + 1)}>
                Zkusit znovu
              </Button>
            }
          />
        ) : !quotes || quotes.length === 0 ? (
          <EmptyRow
            text="Pro zadanou adresu bohužel nenabízíme žádnou dopravu."
            action={
              <Button variant="outline" size="sm" onClick={onBack}>
                Upravit adresu
              </Button>
            }
          />
        ) : (
          <div role="radiogroup" aria-label="Způsob doručení" className="space-y-2.5">
            {quotes.map((q) => (
              <OptionCard
                key={q.rate_id}
                selected={selected === q.rate_id}
                onSelect={() => {
                  if (selected !== q.rate_id && !saving) void choose(q, selected);
                }}
                trailing={<QuotePrice quote={q} locale={locale} />}
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-fg-1">{q.label}</span>
                  {q.carrier ? <span className="text-xs text-fg-3">{q.carrier}</span> : null}
                  {q.requires_pickup_point ? (
                    <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-fg-3">
                      <MapPin aria-hidden className="size-3.5 shrink-0" />
                      Výdejní místo vyberete v dalším kroku
                    </span>
                  ) : null}
                </span>
              </OptionCard>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack} className="text-fg-2">
          <ChevronLeft aria-hidden />
          Zpět na adresu
        </Button>
        <Button type="button" size="lg" disabled={!canContinue} onClick={onDone}>
          {saving ? <Loader2 aria-hidden className="animate-spin" /> : null}
          Pokračovat na platbu
          {!saving ? <ArrowRight aria-hidden /> : null}
        </Button>
      </div>
    </div>
  );
}

/** Right side of a quote row: price (or a free badge) + delivery estimate. */
function QuotePrice({ quote, locale }: { quote: ShippingQuote; locale?: string }) {
  const days = formatDays(quote.estimated_days_min, quote.estimated_days_max);
  return (
    <span className="flex flex-col items-end gap-0.5">
      {quote.is_free ? (
        <span className="rounded-pill bg-success/15 px-2 py-0.5 text-xs font-semibold text-success-fg">
          Zdarma
        </span>
      ) : (
        <span className="num text-sm font-semibold text-fg-1">
          {formatCents(quote.price_cents, quote.currency, locale)}
        </span>
      )}
      {days ? <span className="num text-xs text-fg-3">{days}</span> : null}
    </span>
  );
}

function EmptyRow({ text, action }: { text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-paper-cream-soft px-6 py-10 text-center">
      <PackageX aria-hidden className="size-6 text-fg-3" strokeWidth={1.5} />
      <p className="text-sm text-fg-2">{text}</p>
      {action}
    </div>
  );
}

/** Czech delivery estimate: „1 den" / „2–3 dny" / „5–7 dní". */
function formatDays(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  const plural = (n: number) => (n === 1 ? "den" : n <= 4 ? "dny" : "dní");
  if (min != null && max != null && min !== max) return `${min}–${max} ${plural(max)}`;
  const n = (min ?? max) as number;
  return `${n} ${plural(n)}`;
}
