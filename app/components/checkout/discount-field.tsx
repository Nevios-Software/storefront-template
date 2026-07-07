import * as React from "react";
import { Loader2, TicketPercent, X } from "lucide-react";
import { useCheckout } from "@nevios/storefront-kit";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

/**
 * Discount code input + the applied codes as removable chips. An invalid code
 * shows a red ring + the server's message inline (the page banner skips
 * discount errors so they never double-render).
 */
export function DiscountField({ idPrefix }: { idPrefix: string }) {
  const { checkout, applyDiscount, removeDiscount } = useCheckout();
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [invalid, setInvalid] = React.useState<string | null>(null);
  const [removing, setRemoving] = React.useState<string | null>(null);

  const codes = checkout?.discount_codes ?? [];
  const inputId = `${idPrefix}-discount-code`;

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim();
    if (!c || busy) return;
    setBusy(true);
    setInvalid(null);
    try {
      await applyDiscount(c);
      setCode("");
    } catch (err) {
      setInvalid(err instanceof Error ? err.message : "Kód se nepodařilo použít");
    } finally {
      setBusy(false);
    }
  }

  async function remove(c: string) {
    if (removing) return;
    setRemoving(c);
    try {
      await removeDiscount(c);
    } catch {
      // page banner
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="space-y-2">
      {/* form-in-form is invalid HTML; the summary never sits inside a form,
          so a real <form> keeps Enter-to-apply working. */}
      <form onSubmit={apply} className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="sr-only">
            Slevový kód
          </label>
          <Input
            id={inputId}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (invalid) setInvalid(null);
            }}
            placeholder="Slevový kód"
            autoComplete="off"
            aria-invalid={invalid ? true : undefined}
            aria-describedby={invalid ? `${inputId}-error` : undefined}
            className="bg-card"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={busy || code.trim() === ""}
          className="bg-card"
        >
          {busy ? <Loader2 aria-hidden className="animate-spin" /> : null}
          Použít
        </Button>
      </form>
      {invalid ? (
        <p id={`${inputId}-error`} role="alert" className="fade-in text-xs font-medium text-error-fg">
          {invalid}
        </p>
      ) : null}

      {codes.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5 pt-0.5">
          {codes.map((c) => (
            <li
              key={c}
              className={cn(
                "count-up inline-flex items-center gap-1.5 rounded-pill bg-success/15 py-1 pr-1.5 pl-2.5 text-xs font-semibold text-success-fg",
                removing === c && "pointer-events-none opacity-50",
              )}
            >
              <TicketPercent aria-hidden className="size-3.5" />
              <span className="uppercase">{c}</span>
              <button
                type="button"
                onClick={() => void remove(c)}
                aria-label={`Odebrat kód ${c}`}
                className="flex size-4 items-center justify-center rounded-full outline-none transition-colors duration-fast hover:bg-success/25 focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {removing === c ? (
                  <Loader2 aria-hidden className="size-3 animate-spin" />
                ) : (
                  <X aria-hidden className="size-3" />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
