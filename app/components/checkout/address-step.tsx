import * as React from "react";
import { ArrowRight, CheckCircle2, Loader2, Plus } from "lucide-react";
import type { Address, SetAddressInput } from "@nevios/storefront-js";
import { useCheckout } from "@nevios/storefront-kit";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

import { Reveal } from "./reveal";

/* ── Form model ─────────────────────────────────────────────────────── */

type AddressFormState = {
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postal_code: string;
  country_code: string;
};

const EMPTY_ADDRESS: AddressFormState = {
  first_name: "",
  last_name: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  postal_code: "",
  country_code: "CZ",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function seedAddress(addr: Address | null | undefined): AddressFormState {
  if (!addr) return EMPTY_ADDRESS;
  return {
    first_name: (addr.first_name as string) ?? "",
    last_name: (addr.last_name as string) ?? "",
    company: (addr.company as string) ?? "",
    address1: (addr.address1 as string) ?? "",
    address2: (addr.address2 as string) ?? "",
    city: (addr.city as string) ?? "",
    postal_code: (addr.postal_code as string) ?? "",
    country_code: ((addr.country_code as string) || "CZ").toUpperCase(),
  };
}

function toAddress(f: AddressFormState, phone?: string): Address {
  const a: Address = {
    first_name: f.first_name.trim(),
    last_name: f.last_name.trim(),
    address1: f.address1.trim(),
    city: f.city.trim(),
    postal_code: f.postal_code.trim(),
    country_code: f.country_code,
  };
  if (f.company.trim()) a.company = f.company.trim();
  if (f.address2.trim()) a.address2 = f.address2.trim();
  if (phone?.trim()) a.phone = phone.trim();
  return a;
}

/** Required-field messages for an address group, prefixed for error keys. */
function validateAddress(f: AddressFormState, prefix: string): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!f.first_name.trim()) errs[`${prefix}first_name`] = "Zadejte jméno";
  if (!f.last_name.trim()) errs[`${prefix}last_name`] = "Zadejte příjmení";
  if (!f.address1.trim()) errs[`${prefix}address1`] = "Zadejte ulici a číslo popisné";
  if (!f.city.trim()) errs[`${prefix}city`] = "Zadejte město";
  if (!f.postal_code.trim()) errs[`${prefix}postal_code`] = "Zadejte PSČ";
  return errs;
}

/* ── Step 1: Adresa ─────────────────────────────────────────────────── */

export function AddressStep({ onDone }: { onDone: () => void }) {
  const { checkout, setAddress } = useCheckout();

  const [email, setEmail] = React.useState(() => checkout?.email ?? "");
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [phone, setPhone] = React.useState(
    () => (checkout?.shipping_address?.phone as string) ?? "",
  );
  const [shipping, setShipping] = React.useState<AddressFormState>(() =>
    seedAddress(checkout?.shipping_address),
  );
  const [billing, setBilling] = React.useState<AddressFormState>(() =>
    seedAddress(checkout?.billing_address),
  );
  const [sameAsShipping, setSameAsShipping] = React.useState(
    () => checkout?.same_as_shipping ?? true,
  );
  const [showCompany, setShowCompany] = React.useState(
    () => Boolean(checkout?.shipping_address?.company),
  );
  const [showNote, setShowNote] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const emailValid = EMAIL_RE.test(email.trim());
  const emailError =
    errors.email ??
    (emailTouched && email.trim() !== "" && !emailValid ? "Zadejte platný e-mail" : undefined);

  const setShippingField = (key: keyof AddressFormState) => (value: string) => {
    setShipping((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[`s.${key}`] ? { ...e, [`s.${key}`]: "" } : e));
  };
  const setBillingField = (key: keyof AddressFormState) => (value: string) => {
    setBilling((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[`b.${key}`] ? { ...e, [`b.${key}`]: "" } : e));
  };

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Zadejte e-mail";
    else if (!emailValid) errs.email = "Zadejte platný e-mail";
    Object.assign(errs, validateAddress(shipping, "s."));
    if (!sameAsShipping) Object.assign(errs, validateAddress(billing, "b."));
    return errs;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const errs = validate();
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    const input: SetAddressInput = {
      email: email.trim(),
      shipping_address: toAddress(shipping, phone),
      same_as_shipping: sameAsShipping,
    };
    if (!sameAsShipping) input.billing_address = toAddress(billing);
    if (note.trim()) input.customer_note = note.trim();

    setSubmitting(true);
    try {
      await setAddress(input);
      onDone();
    } catch {
      // Server error → the page-level dismissible banner shows error.message.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="rounded-2xl bg-card p-5 ring-1 ring-inset ring-[var(--hairline)] sm:p-6">
        <h2 className="text-lg font-bold text-fg-1">Doručovací údaje</h2>
        <p className="mt-1 text-sm text-fg-3">Kam vám máme objednávku poslat?</p>

        <div className="mt-5 space-y-4">
          <TextField
            id="checkout-email"
            label="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              setErrors((e) => (e.email ? { ...e, email: "" } : e));
            }}
            onBlur={() => setEmailTouched(true)}
            error={emailError || undefined}
            trailing={
              emailValid ? (
                <CheckCircle2 aria-hidden className="fade-in size-4 text-success-fg" />
              ) : undefined
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="checkout-first-name"
              label="Jméno"
              autoComplete="given-name"
              value={shipping.first_name}
              onChange={setShippingField("first_name")}
              error={errors["s.first_name"] || undefined}
            />
            <TextField
              id="checkout-last-name"
              label="Příjmení"
              autoComplete="family-name"
              value={shipping.last_name}
              onChange={setShippingField("last_name")}
              error={errors["s.last_name"] || undefined}
            />
          </div>

          <DisclosureToggle
            open={showCompany}
            onToggle={() => setShowCompany((o) => !o)}
            label="Firma"
          />
          <Reveal open={showCompany} className="-mt-2">
            <div className="pt-2">
              <TextField
                id="checkout-company"
                label="Firma"
                optional
                autoComplete="organization"
                value={shipping.company}
                onChange={setShippingField("company")}
              />
            </div>
          </Reveal>

          <TextField
            id="checkout-address1"
            label="Ulice a číslo popisné"
            autoComplete="address-line1"
            value={shipping.address1}
            onChange={setShippingField("address1")}
            error={errors["s.address1"] || undefined}
          />
          <TextField
            id="checkout-address2"
            label="Byt, patro apod."
            optional
            autoComplete="address-line2"
            value={shipping.address2}
            onChange={setShippingField("address2")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="checkout-city"
              label="Město"
              autoComplete="address-level2"
              value={shipping.city}
              onChange={setShippingField("city")}
              error={errors["s.city"] || undefined}
            />
            <TextField
              id="checkout-postal"
              label="PSČ"
              autoComplete="postal-code"
              value={shipping.postal_code}
              onChange={setShippingField("postal_code")}
              error={errors["s.postal_code"] || undefined}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="checkout-country" className="text-fg-2">
                Země
              </Label>
              <CountrySelect
                id="checkout-country"
                value={shipping.country_code}
                onChange={setShippingField("country_code")}
              />
            </div>
            <TextField
              id="checkout-phone"
              label="Telefon"
              optional
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={setPhone}
            />
          </div>

          {/* Billing toggle + animated reveal */}
          <div className="rounded-xl bg-paper-cream-soft px-4 py-3.5 ring-1 ring-inset ring-[var(--hairline-soft)]">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="checkout-same-billing"
                checked={sameAsShipping}
                onCheckedChange={(v) => setSameAsShipping(v === true)}
              />
              <Label htmlFor="checkout-same-billing" className="cursor-pointer text-fg-1">
                Doručovací adresa je i fakturační
              </Label>
            </div>
            <Reveal open={!sameAsShipping}>
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-fg-1">Fakturační adresa</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="billing-first-name"
                    label="Jméno"
                    value={billing.first_name}
                    onChange={setBillingField("first_name")}
                    error={errors["b.first_name"] || undefined}
                  />
                  <TextField
                    id="billing-last-name"
                    label="Příjmení"
                    value={billing.last_name}
                    onChange={setBillingField("last_name")}
                    error={errors["b.last_name"] || undefined}
                  />
                </div>
                <TextField
                  id="billing-company"
                  label="Firma"
                  optional
                  value={billing.company}
                  onChange={setBillingField("company")}
                />
                <TextField
                  id="billing-address1"
                  label="Ulice a číslo popisné"
                  value={billing.address1}
                  onChange={setBillingField("address1")}
                  error={errors["b.address1"] || undefined}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="billing-city"
                    label="Město"
                    value={billing.city}
                    onChange={setBillingField("city")}
                    error={errors["b.city"] || undefined}
                  />
                  <TextField
                    id="billing-postal"
                    label="PSČ"
                    value={billing.postal_code}
                    onChange={setBillingField("postal_code")}
                    error={errors["b.postal_code"] || undefined}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="billing-country" className="text-fg-2">
                    Země
                  </Label>
                  <CountrySelect
                    id="billing-country"
                    value={billing.country_code}
                    onChange={setBillingField("country_code")}
                  />
                </div>
              </div>
            </Reveal>
          </div>

          <DisclosureToggle
            open={showNote}
            onToggle={() => setShowNote((o) => !o)}
            label="Přidat poznámku"
          />
          <Reveal open={showNote} className="-mt-2">
            <div className="space-y-1.5 pt-2">
              <Label htmlFor="checkout-note" className="text-fg-2">
                Poznámka k objednávce
                <span className="text-xs font-normal text-fg-3">(nepovinné)</span>
              </Label>
              <textarea
                id="checkout-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Např. zvoňte na sousedy, balík nechte u dveří…"
                className="w-full min-w-0 resize-none rounded-md bg-transparent px-3 py-2 text-base ring-1 ring-inset ring-[var(--hairline)] outline-none transition-[box-shadow] duration-base placeholder:text-fg-4 focus-visible:ring-2 focus-visible:ring-ring/50 md:text-sm"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-6">
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? (
              <Loader2 aria-hidden className="animate-spin" />
            ) : null}
            Pokračovat na dopravu
            {!submitting ? <ArrowRight aria-hidden /> : null}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ── Local field primitives ─────────────────────────────────────────── */

function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  optional,
  type = "text",
  autoComplete,
  trailing,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  optional?: boolean;
  type?: string;
  autoComplete?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-fg-2">
        {label}
        {optional ? <span className="text-xs font-normal text-fg-3">(nepovinné)</span> : null}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("bg-card", trailing && "pr-9")}
        />
        {trailing ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            {trailing}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="fade-in text-xs font-medium text-error-fg">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CountrySelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full bg-card">
        <SelectValue placeholder="Vyberte zemi" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="CZ">Česko</SelectItem>
        <SelectItem value="SK">Slovensko</SelectItem>
      </SelectContent>
    </Select>
  );
}

/** "+ Firma" / "+ Přidat poznámku" — the plus rotates into an × when open. */
function DisclosureToggle({
  open,
  onToggle,
  label,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-fg-3 outline-none transition-colors duration-base hover:text-fg-1 focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Plus
        aria-hidden
        className={cn(
          "size-3.5 transition-transform duration-base ease-spring-soft motion-reduce:transition-none",
          open && "rotate-45",
        )}
      />
      {label}
    </button>
  );
}
