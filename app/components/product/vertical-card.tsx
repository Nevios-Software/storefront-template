import { Link } from "react-router";
import { Heart, Plus, ShoppingBag, Star, type LucideIcon } from "lucide-react";

import { cn } from "~/lib/utils";

// ===========================================================================
// TYPES
// ===========================================================================

export type VerticalCardVariant = "framed" | "plain" | "story";
export type VerticalCardHalo = "none" | "peach" | "cream" | "coral";
export type VerticalCardQuickAdd = "none" | "icon" | "wide" | "floating";
export type VerticalCardBadgeTone = "new" | "sale" | "info";
export type VerticalCardRatingPosition = "header" | "below-info";
export type VerticalCardTagsPosition = "above-image" | "below-info";
export type VerticalCardSurface =
  | "card"
  | "cream-soft"
  | "cream"
  | "peach"
  | "transparent"
  | "custom";

export interface VerticalCardTag {
  /** Lucide icon — no native emojis. */
  icon?: LucideIcon;
  label: string;
}

export interface VerticalCardSwatch {
  /** Tailwind bg-* class or hex color. */
  color: string;
  label?: string;
}

export interface VerticalCardProps {
  // ─── Data (povinné) ─────────────────────────────────────────────────────
  href: string;
  name: string;
  caption?: string;
  image: string;
  imageAlt?: string;
  price: number;
  originalPrice?: number;
  /** ISO currency for price formatting. Default CZK. */
  currency?: string;
  locale?: string;

  // ─── Variant — base layout ──────────────────────────────────────────────
  variant?: VerticalCardVariant;

  // ─── Surface override ──────────────────────────────────────────────────
  frameBg?: VerticalCardSurface;
  frameBgCustom?: string;
  imageBg?: VerticalCardSurface;
  imageBgCustom?: string;

  // ─── Volitelné parametry ────────────────────────────────────────────────
  halo?: VerticalCardHalo;
  badge?: { label: string; tone?: VerticalCardBadgeTone };

  quickAdd?: VerticalCardQuickAdd;
  onAddToCart?: () => void;

  rating?: { value: number; count: number };
  ratingPosition?: VerticalCardRatingPosition;

  tags?: VerticalCardTag[];
  tagsPosition?: VerticalCardTagsPosition;

  swatches?: VerticalCardSwatch[];

  className?: string;
}

// ===========================================================================
// CONSTANTS
// ===========================================================================

const HALO_CLASSES: Record<VerticalCardHalo, string> = {
  none: "",
  peach: "bg-paper-peach/60",
  cream: "bg-paper-cream/70",
  coral: "bg-coral/30",
};

const BADGE_TONE_CLASSES: Record<VerticalCardBadgeTone, string> = {
  new: "bg-paper-peach text-coral",
  sale: "bg-coral text-white",
  info: "bg-card text-fg-1 ring-1 ring-inset ring-[var(--hairline-soft)]",
};

const SURFACE_CLASSES: Record<VerticalCardSurface, string> = {
  card: "bg-card",
  "cream-soft": "bg-paper-cream-soft",
  cream: "bg-paper-cream",
  peach: "bg-paper-peach",
  transparent: "bg-transparent",
  custom: "", // background set via inline style
};

// ===========================================================================
// COMPONENT
// ===========================================================================

/**
 * VerticalCard — composable product card for grid/rail. Ported verbatim from
 * the Bodybe Next store (`components/product/vertical-card.tsx`); the only
 * changes are the framework seams (next/link → react-router Link, next/image
 * → img, no "use client").
 */
export function VerticalCard({
  href,
  name,
  caption,
  image,
  imageAlt = "",
  price,
  originalPrice,
  currency = "CZK",
  locale = "cs-CZ",
  variant = "framed",
  frameBg = "card",
  frameBgCustom,
  imageBg = "cream-soft",
  imageBgCustom,
  halo = "none",
  badge,
  quickAdd = "none",
  onAddToCart,
  rating,
  ratingPosition = "below-info",
  tags,
  tagsPosition = "above-image",
  swatches,
  className,
}: VerticalCardProps) {
  const haloClass = HALO_CLASSES[halo];
  const frameSurfaceClass = SURFACE_CLASSES[frameBg];
  const imageSurfaceClass = SURFACE_CLASSES[imageBg];
  const frameStyle =
    frameBg === "custom" && frameBgCustom
      ? { backgroundColor: frameBgCustom }
      : undefined;
  const imageStyle =
    imageBg === "custom" && imageBgCustom
      ? { backgroundColor: imageBgCustom }
      : undefined;
  const isStory = variant === "story";
  const isFramed = variant === "framed";

  const card = (
    <div
      className={cn(
        "relative flex h-full flex-col",
        isFramed &&
          "rounded-2xl p-4 ring-1 ring-inset ring-[var(--hairline-soft)]",
        isFramed && frameSurfaceClass,
        quickAdd === "floating" && !isStory && "pr-12",
      )}
      style={isFramed ? frameStyle : undefined}
    >
      {/* Rating in header — above image, with ♡ on the right */}
      {rating && ratingPosition === "header" && !isStory && (
        <div className="mb-3 flex items-center justify-between">
          <RatingRow value={rating.value} count={rating.count} />
          <button
            type="button"
            aria-label="Přidat do oblíbených"
            className="text-fg-3 hover:text-coral transition-colors"
          >
            <Heart className="size-4" />
          </button>
        </div>
      )}

      {/* Tags above image */}
      {tags && tags.length > 0 && tagsPosition === "above-image" && !isStory && (
        <TagRow tags={tags} className="mb-3" />
      )}

      {/* Image — story overlay vs stacked */}
      {isStory ? (
        <Link
          to={href}
          className={cn(
            "relative block aspect-[4/5] overflow-hidden rounded-xl",
            imageSurfaceClass,
          )}
          style={imageStyle}
        >
          <img
            src={image}
            alt={imageAlt || name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-6"
          />
          {badge && <BadgeChip badge={badge} className="left-4 top-4" />}
          <div className="bg-card/85 absolute bottom-4 left-4 right-4 rounded-pill px-3 py-1.5 text-xs backdrop-blur">
            <p className="num flex items-center justify-between">
              <span className="text-fg-1 font-semibold">{name}</span>
              <span className="text-fg-1 font-bold">{formatPrice(price, currency, locale)}</span>
            </p>
          </div>
        </Link>
      ) : (
        <>
          <Link
            to={href}
            className={cn(
              "relative block aspect-square overflow-hidden rounded-xl p-3",
              imageSurfaceClass,
            )}
            style={imageStyle}
          >
            <img
              src={image}
              alt={imageAlt || name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-3"
            />
            {badge && <BadgeChip badge={badge} className="left-3 top-3" />}
          </Link>

          {/* Swatch dots row */}
          {swatches && swatches.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              {swatches.slice(0, 4).map((s) => (
                <span
                  key={s.color + (s.label ?? "")}
                  title={s.label}
                  className={cn(
                    "size-3 rounded-full ring-1 ring-inset ring-[var(--hairline-soft)]",
                    s.color.startsWith("bg-") ? s.color : "",
                  )}
                  style={
                    s.color.startsWith("bg-")
                      ? undefined
                      : { backgroundColor: s.color }
                  }
                />
              ))}
              {swatches.length > 4 && (
                <span className="text-fg-3 ml-auto text-[10px]">
                  +{swatches.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Info block */}
          <div className="mt-3 flex flex-1 flex-col">
            <Link to={href} className="block">
              <p className="text-fg-1 text-sm font-semibold leading-tight">
                {name}
              </p>
              {caption && (
                <p className="text-fg-3 mt-0.5 text-xs">{caption}</p>
              )}
            </Link>

            {/* Rating below info (default position) */}
            {rating && ratingPosition === "below-info" && (
              <div className="mt-2">
                <RatingRow value={rating.value} count={rating.count} />
              </div>
            )}

            {/* Tags below info */}
            {tags && tags.length > 0 && tagsPosition === "below-info" && (
              <TagRow tags={tags} className="mt-2" />
            )}

            <div className="mt-auto pt-3">
              <PriceLine v={price} o={originalPrice} currency={currency} locale={locale} />
            </div>
          </div>
        </>
      )}

      {/* Quick-add — wide */}
      {quickAdd === "wide" && !isStory && (
        <button
          type="button"
          onClick={onAddToCart}
          className="bg-coral hover:bg-[var(--brand-hover,#d04a44)] mt-3 inline-flex w-full items-center justify-center gap-2 rounded-pill px-3 py-2 text-xs font-semibold text-white transition-colors"
        >
          <Plus className="size-3.5" /> Do košíku
        </button>
      )}

      {/* Quick-add — icon */}
      {quickAdd === "icon" && !isStory && (
        <button
          type="button"
          onClick={onAddToCart}
          aria-label="Přidat do košíku"
          className="bg-coral text-white absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-105"
        >
          <Plus className="size-4" />
        </button>
      )}

      {/* Quick-add — floating */}
      {quickAdd === "floating" && !isStory && (
        <button
          type="button"
          onClick={onAddToCart}
          aria-label="Přidat do košíku"
          className="bg-coral text-white absolute bottom-4 right-4 inline-flex size-10 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
        >
          <ShoppingBag className="size-4" />
        </button>
      )}
    </div>
  );

  // Halo wrapper — pastel blur behind the card
  if (halo !== "none") {
    return (
      <article className={cn("relative px-3 py-4", className)}>
        <div
          aria-hidden
          className={cn("absolute inset-0 rounded-[3rem] blur-2xl", haloClass)}
        />
        <div className="relative">{card}</div>
      </article>
    );
  }

  return <article className={className}>{card}</article>;
}

// ===========================================================================
// SUB-PIECES
// ===========================================================================

function TagRow({ tags, className }: { tags: VerticalCardTag[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((t) => (
        <span
          key={t.label}
          className="bg-paper-cream text-fg-1 inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold"
        >
          {t.icon && <t.icon className="size-3" strokeWidth={1.8} />}
          {t.label}
        </span>
      ))}
    </div>
  );
}

function BadgeChip({
  badge,
  className,
}: {
  badge: NonNullable<VerticalCardProps["badge"]>;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "absolute inline-flex items-center rounded-pill px-2.5 py-1 text-[10px] font-semibold",
        BADGE_TONE_CLASSES[badge.tone ?? "new"],
        className,
      )}
    >
      {badge.label}
    </span>
  );
}

function RatingRow({ value, count }: { value: number; count: number }) {
  return (
    <span className="num text-fg-3 inline-flex items-center gap-1 text-[11px]">
      <Star
        className="size-3 fill-current text-[var(--warning)]"
        strokeWidth={0}
      />
      {value.toFixed(1)} ({count})
    </span>
  );
}

function PriceLine({ v, o, currency, locale }: { v: number; o?: number; currency: string; locale: string }) {
  return (
    <p className="num">
      <span className="text-fg-1 text-base font-bold">{formatPrice(v, currency, locale)}</span>
      {o && (
        <span className="text-fg-4 ml-2 text-xs line-through">
          {formatPrice(o, currency, locale)}
        </span>
      )}
    </p>
  );
}

function formatPrice(n: number, currency = "CZK", locale = "cs-CZ"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}
