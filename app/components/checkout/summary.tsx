import * as React from "react";
import { ChevronDown, ShoppingBag } from "lucide-react";
import type { Checkout } from "@nevios/storefront-js";
import { formatCents } from "@nevios/storefront-kit";

import { MediaImage } from "~/components/shared/media-image";
import { cn } from "~/lib/utils";

import { AnimatedPrice } from "./animated-price";
import { DiscountField } from "./discount-field";
import { Reveal } from "./reveal";

/** Sticky order summary for the desktop right column. */
export function SummaryCard({ checkout, locale }: { checkout: Checkout; locale?: string }) {
  return (
    <aside
      aria-label="Souhrn objednávky"
      className="hidden rounded-2xl bg-paper-cream-soft p-5 ring-1 ring-inset ring-[var(--hairline-soft)] lg:sticky lg:top-24 lg:block"
    >
      <h2 className="mb-4 text-base font-bold text-fg-1">Souhrn objednávky</h2>
      <SummaryBody checkout={checkout} locale={locale} idPrefix="desktop" />
    </aside>
  );
}

/** Mobile: collapsible summary on top of the steps — total stays visible when
 *  collapsed, the body opens with the grid-rows height animation. */
export function MobileSummary({ checkout, locale }: { checkout: Checkout; locale?: string }) {
  const [open, setOpen] = React.useState(false);
  const t = checkout.totals;
  return (
    <section
      aria-label="Souhrn objednávky"
      className="rounded-2xl bg-paper-cream-soft ring-1 ring-inset ring-[var(--hairline-soft)] lg:hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-fg-1">
          <ShoppingBag aria-hidden className="size-4 text-fg-2" />
          Souhrn objednávky
          <span className="num text-fg-3">({t.item_count})</span>
        </span>
        <span className="flex items-center gap-2">
          <AnimatedPrice
            cents={t.total_cents}
            currency={t.currency}
            locale={locale}
            className="text-sm font-bold text-fg-1"
          />
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 text-fg-3 transition-transform duration-base ease-spring-soft motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </span>
      </button>
      <Reveal open={open}>
        <div className="px-5 pb-5">
          <SummaryBody checkout={checkout} locale={locale} idPrefix="mobile" />
        </div>
      </Reveal>
    </section>
  );
}

/* ── Shared body: lines → discount → totals ─────────────────────────── */

function SummaryBody({
  checkout,
  locale,
  idPrefix,
}: {
  checkout: Checkout;
  locale?: string;
  idPrefix: string;
}) {
  const t = checkout.totals;
  const cur = t.currency;
  const shippingChosen = checkout.shipping_method != null;

  return (
    <div className="space-y-4">
      {/* Line items */}
      <ul className="space-y-3.5">
        {checkout.line_items.map((line) => (
          <li key={line.id} className="flex items-center gap-3">
            <span className="relative shrink-0">
              <MediaImage
                src={line.image_url}
                alt={line.title ?? ""}
                width={112}
                className="image-well size-14 rounded-lg object-cover"
              />
              <span
                aria-hidden
                className="num absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold text-white"
              >
                {line.quantity}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-fg-1">
                {line.title ?? "Položka"}
              </span>
              <span className="block truncate text-xs text-fg-3">
                {[line.variant_title, `${line.quantity} ks`].filter(Boolean).join(" · ")}
              </span>
            </span>
            <span className="num shrink-0 text-sm font-semibold text-fg-1">
              {formatCents(line.line_total_cents, cur, locale)}
            </span>
          </li>
        ))}
      </ul>

      <Hairline />

      <DiscountField idPrefix={idPrefix} />

      <Hairline />

      {/* Totals — animated figures roll on every shipping/payment/discount change */}
      <dl className="space-y-2">
        <Row label="Mezisoučet">
          <AnimatedPrice
            cents={t.subtotal_with_tax_cents}
            currency={cur}
            locale={locale}
            className="text-sm font-medium text-fg-1"
          />
        </Row>
        <Row label="Doprava">
          {!shippingChosen ? (
            <span className="text-sm text-fg-3">Vypočítá se</span>
          ) : t.shipping_cents === 0 ? (
            <span className="fade-in text-sm font-semibold text-success-fg">Zdarma</span>
          ) : (
            <AnimatedPrice
              cents={t.shipping_cents}
              currency={cur}
              locale={locale}
              className="text-sm font-medium text-fg-1"
            />
          )}
        </Row>
        {t.discount_cents > 0 ? (
          <Row label="Sleva" labelClassName="text-success-fg">
            <AnimatedPrice
              cents={-t.discount_cents}
              currency={cur}
              locale={locale}
              className="text-sm font-semibold text-success-fg"
            />
          </Row>
        ) : null}
        {t.surcharge_cents > 0 ? (
          <Row label="Poplatek za platbu">
            <AnimatedPrice
              cents={t.surcharge_cents}
              currency={cur}
              locale={locale}
              className="text-sm font-medium text-fg-1"
            />
          </Row>
        ) : null}
      </dl>

      <Hairline />

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-base font-bold text-fg-1">Celkem</span>
          <AnimatedPrice
            cents={t.total_cents}
            currency={cur}
            locale={locale}
            className="text-lg font-bold text-fg-1"
          />
        </div>
        <p className="num mt-1 text-right text-xs text-fg-3">
          Včetně DPH {formatCents(t.tax_cents, cur, locale)}
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  labelClassName,
  children,
}: {
  label: string;
  labelClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn("text-sm text-fg-2", labelClassName)}>{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

function Hairline() {
  return <div aria-hidden className="h-px bg-[var(--hairline)]" />;
}
