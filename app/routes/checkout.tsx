import * as React from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Loader2, ShoppingBag, X } from "lucide-react";
import type { Checkout } from "@nevios/storefront-js";
import { StorefrontError } from "@nevios/storefront-js";
import {
  CheckoutProvider,
  useCart,
  useCheckout,
  useStorefront,
} from "@nevios/storefront-kit";

import type { Route } from "./+types/checkout";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { AddressStep } from "../components/checkout/address-step";
import { PaymentStep } from "../components/checkout/payment-step";
import { ShippingStep } from "../components/checkout/shipping-step";
import {
  CheckoutStepper,
  stepRank,
  type CheckoutStep,
} from "../components/checkout/stepper";
import { MobileSummary, SummaryCard } from "../components/checkout/summary";
import { useMarketData } from "../lib/market";
import { shop } from "../../nevios.config";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Pokladna · ${shop.name}` }];
}

/**
 * Checkout — the UI is owned here (stepper, steps, summary in
 * `components/checkout/*`); the ENGINE stays the kit's `useCheckout()` hooks,
 * mirroring the kit CheckoutFlow's orchestration exactly: resume from the
 * stored token, create from the cart token, gateway redirect vs direct
 * completion, order_status_token → /order/:token.
 */
export default function CheckoutRoute() {
  return (
    <div className="section-bb py-8 lg:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <CheckoutProvider>
          <CheckoutPage />
        </CheckoutProvider>
      </div>
    </div>
  );
}

/* ── Orchestration ──────────────────────────────────────────────────── */

/** Where the checkout stands, from its server state (kit-parity resume). */
function reachedStep(checkout: Checkout | null): CheckoutStep {
  if (!checkout) return "address";
  if (checkout.shipping_method != null) return "payment";
  if (checkout.email && checkout.shipping_address != null) return "shipping";
  return "address";
}

/**
 * True once a provider's initial fetch has concluded. Both providers refresh
 * on mount; loading starts false, so "not loading" alone can't be trusted on
 * the very first pass — we skip it and settle on any later quiet pass (the
 * checkout provider's refresh guarantees follow-up renders).
 */
function useSettled(loading: boolean, ready: boolean): boolean {
  const [settled, setSettled] = React.useState(false);
  const passes = React.useRef(0);
  React.useEffect(() => {
    if (settled) return;
    passes.current += 1;
    if (ready) setSettled(true);
    else if (!loading && passes.current > 1) setSettled(true);
  });
  return settled;
}

function CheckoutPage() {
  const { locale } = useMarketData();
  const navigate = useNavigate();
  const client = useStorefront();
  const { cart, loading: cartLoading, refresh: refreshCart } = useCart();
  const { checkout, loading, error, create, refresh: refreshCheckout } = useCheckout();

  const checkoutSettled = useSettled(loading, checkout != null);
  const cartSettled = useSettled(cartLoading, cart != null);

  const [step, setStep] = React.useState<CheckoutStep>("address");
  const [bootstrapped, setBootstrapped] = React.useState(false);
  const [dismissedError, setDismissedError] = React.useState<Error | null>(null);
  const resumedRef = React.useRef(false);

  const reached = reachedStep(checkout);

  // Resume: when the checkout first appears (stored token or fresh create),
  // jump to the step its server state has reached. Runs once — after that the
  // customer navigates explicitly (steps never auto-skip forward).
  React.useEffect(() => {
    if (!checkout || resumedRef.current) return;
    resumedRef.current = true;
    setStep(reachedStep(checkout));
  }, [checkout]);

  // Clamp: if the server state regresses (e.g. a new address cleared the
  // shipping method), never show a step ahead of what's actually filled.
  React.useEffect(() => {
    setStep((cur) => (stepRank(cur) > stepRank(reached) ? reached : cur));
  }, [reached]);

  // No checkout yet + the cart has lines → snapshot it into a fresh checkout.
  React.useEffect(() => {
    if (checkout || bootstrapped || !checkoutSettled) return;
    const token = cart?.token;
    if (!token || (cart?.line_items.length ?? 0) === 0) return;
    setBootstrapped(true);
    void create(token).catch(() => {
      // Failure surfaces via the hook's `error` + the retry view below.
    });
  }, [checkout, bootstrapped, checkoutSettled, cart, create]);

  // Expired / vanished checkout mid-session (its token outlived the server
  // TTL) → recover instead of stranding the customer: forget the stale token
  // and let the bootstrap effect snapshot the live cart into a fresh checkout.
  const expired =
    error instanceof StorefrontError &&
    (error.code === "checkout_not_found" || /expired/i.test(error.message));
  React.useEffect(() => {
    if (!expired) return;
    client.checkout.clear();
    resumedRef.current = false;
    setDismissedError(error); // the recovery is silent — no scary banner
    setStep("address");
    setBootstrapped(false); // re-arm the bootstrap → create(cart.token)
    void refreshCheckout(); // drop the dead checkout from provider state
  }, [expired, error, client, refreshCheckout]);

  // Order placed (fresh `pay()` completion or a resumed phase=success
  // checkout, e.g. returning from a gateway) → forget cart + checkout
  // tokens and hand over to the order-status page.
  const placedToken = checkout?.order_id ? checkout.order_status_token : null;
  React.useEffect(() => {
    if (!placedToken) return;
    client.cart.clear();
    client.checkout.clear();
    void refreshCart(); // header badge → 0
    void navigate(`/order/${placedToken}`, { replace: true });
  }, [placedToken, client, refreshCart, navigate]);

  // Global error banner — dismissible; discount errors render inline in the
  // summary's discount field, so they're filtered out here.
  const showError =
    error != null &&
    error !== dismissedError &&
    !(error instanceof StorefrontError && error.code === "discount_invalid");

  let content: React.ReactNode;
  if (checkout?.order_id) {
    content = <PlacedCard redirecting={placedToken != null} />;
  } else if (!checkout) {
    if (!checkoutSettled || !cartSettled) {
      content = <BootSkeleton />;
    } else if ((cart?.line_items.length ?? 0) > 0) {
      content =
        !bootstrapped || loading ? (
          <BootSkeleton />
        ) : (
          <CreateFailedCard onRetry={() => setBootstrapped(false)} />
        );
    } else {
      content = <EmptyCartCard />;
    }
  } else {
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-10">
        <div className="min-w-0 space-y-6">
          <MobileSummary checkout={checkout} locale={locale} />
          <CheckoutStepper
            current={step}
            reached={reached}
            onStepClick={(s) => {
              if (stepRank(s) <= stepRank(reached)) setStep(s);
            }}
          />
          {/* Re-keying on the step re-mounts the content with .fade-in */}
          <div key={step} className="fade-in">
            {step === "address" ? (
              <AddressStep onDone={() => setStep("shipping")} />
            ) : step === "shipping" ? (
              <ShippingStep
                onDone={() => setStep("payment")}
                onBack={() => setStep("address")}
                locale={locale}
              />
            ) : (
              <PaymentStep onBack={() => setStep("shipping")} locale={locale} />
            )}
          </div>
        </div>
        <SummaryCard checkout={checkout} locale={locale} />
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-fg-1 sm:text-4xl">Pokladna</h1>
      {showError ? (
        <ErrorBanner message={error.message} onDismiss={() => setDismissedError(error)} />
      ) : null}
      {content}
    </>
  );
}

/* ── Page states ────────────────────────────────────────────────────── */

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      role="alert"
      className="fade-in mb-6 flex items-start gap-3 rounded-xl bg-error/10 px-4 py-3 ring-1 ring-inset ring-error/30"
    >
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-error-fg" />
      <p className="min-w-0 flex-1 text-sm font-medium text-error-fg">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Zavřít upozornění"
        className="rounded-md p-0.5 text-error-fg/70 outline-none transition-colors duration-fast hover:text-error-fg focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function BootSkeleton() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-10">
      <div className="min-w-0 space-y-6">
        <Skeleton className="h-14 rounded-2xl lg:hidden" />
        <div className="grid grid-cols-3 justify-items-center">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
        <Skeleton className="h-[26rem] rounded-2xl" />
      </div>
      <Skeleton className="hidden h-96 rounded-2xl lg:block" />
    </div>
  );
}

function EmptyCartCard() {
  return (
    <div className="fade-in rounded-2xl bg-paper-cream-soft px-6 py-16 text-center">
      <span
        aria-hidden
        className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-paper-peach text-fg-2"
      >
        <ShoppingBag className="size-6" />
      </span>
      <p className="font-semibold text-fg-1">Košík je prázdný</p>
      <p className="mt-1 text-sm text-fg-3">Než projdete pokladnou, vložte si něco do košíku.</p>
      <Button asChild className="mt-5">
        <Link to="/collections">Prozkoumat kolekce</Link>
      </Button>
    </div>
  );
}

function CreateFailedCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="fade-in rounded-2xl bg-paper-cream-soft px-6 py-16 text-center">
      <span
        aria-hidden
        className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-error/10 text-error-fg"
      >
        <AlertCircle className="size-6" />
      </span>
      <p className="font-semibold text-fg-1">Pokladnu se nepodařilo otevřít</p>
      <p className="mt-1 text-sm text-fg-3">Zkontrolujte připojení a zkuste to prosím znovu.</p>
      <Button onClick={onRetry} className="mt-5">
        Zkusit znovu
      </Button>
    </div>
  );
}

/** Order placed. With a status token we're mid-redirect to /order/:token;
 *  without one (edge case) show a static confirmation. */
function PlacedCard({ redirecting }: { redirecting: boolean }) {
  return (
    <div className="fade-in rounded-2xl bg-paper-cream-soft px-6 py-16 text-center">
      <span
        aria-hidden
        className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/15 text-success-fg"
      >
        <CheckCircle2 className="size-7" />
      </span>
      <p className="font-semibold text-fg-1">Objednávka byla přijata</p>
      {redirecting ? (
        <p className="mt-1 inline-flex items-center gap-2 text-sm text-fg-3">
          <Loader2 aria-hidden className="size-4 animate-spin" />
          Přesměrováváme na stav objednávky…
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-fg-3">Potvrzení jsme vám poslali na e-mail.</p>
          <Button asChild className="mt-5">
            <Link to="/">Zpět do obchodu</Link>
          </Button>
        </>
      )}
    </div>
  );
}
