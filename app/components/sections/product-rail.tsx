import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { Eyebrow } from "~/components/shared/eyebrow";
import {
  VerticalCard,
  type VerticalCardBadgeTone,
} from "~/components/product/vertical-card";

export interface RailProduct {
  href: string;
  name: string;
  caption?: string;
  image: string;
  imageAlt?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  locale?: string;
  rating?: number;
  reviewCount?: number;
  /** Status marker — variant maps to the VerticalCard badge tone. */
  badge?: {
    variant: "sale" | "new" | "bestseller" | "soldout" | "sleva";
    label?: string;
  };
}

const BADGE_LABELS: Record<NonNullable<RailProduct["badge"]>["variant"], string> = {
  sale: "Sleva",
  sleva: "Sleva",
  new: "Novinka",
  bestseller: "Bestseller",
  soldout: "Vyprodáno",
};

const BADGE_TONE: Record<
  NonNullable<RailProduct["badge"]>["variant"],
  VerticalCardBadgeTone
> = {
  sale: "sale",
  sleva: "sale",
  new: "new",
  bestseller: "info",
  soldout: "info",
};

export function railToVerticalProps(p: RailProduct) {
  return {
    href: p.href,
    name: p.name,
    caption: p.caption,
    image: p.image,
    imageAlt: p.imageAlt,
    price: p.price,
    originalPrice: p.originalPrice,
    currency: p.currency,
    locale: p.locale,
    variant: "plain" as const,
    rating:
      typeof p.rating === "number"
        ? { value: p.rating, count: p.reviewCount ?? 0 }
        : undefined,
    ratingPosition: "below-info" as const,
    tagsPosition: "below-info" as const,
    badge: p.badge
      ? {
          label: p.badge.label ?? BADGE_LABELS[p.badge.variant],
          tone: BADGE_TONE[p.badge.variant],
        }
      : undefined,
  };
}

interface ProductRailProps {
  eyebrow?: string;
  title: string;
  description?: string;
  products: RailProduct[];
  viewAllHref?: string;
  layout?: "grid" | "scroll";
  cardStack?: boolean;
  endLink?: { href: string; label: string };
  className?: string;
}

/**
 * Titled product carousel — `grid` (responsive) or `scroll` (horizontal rail).
 * Ported verbatim from the Bodybe Next store; only framework seams changed.
 */
export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  viewAllHref,
  layout = "grid",
  cardStack,
  endLink,
  className,
}: ProductRailProps) {
  return (
    <section className={cn("", className)}>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
          <h2 className="text-2xl font-bold text-fg-1 sm:text-3xl">{title}</h2>
          {description && <p className="mt-2 max-w-xl text-sm text-fg-2">{description}</p>}
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-coral transition-colors hover:text-[var(--brand-hover)]"
          >
            Zobrazit vše <ArrowRight className="size-4" />
          </Link>
        )}
      </header>

      {layout === "grid" ? (
        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", cardStack && "card-stack")}>
          {products.map((p) => (
            <VerticalCard key={p.name + p.href} {...railToVerticalProps(p)} />
          ))}
          {endLink && <EndCard {...endLink} variant="grid" />}
        </div>
      ) : (
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className={cn("flex gap-4", cardStack && "card-stack")}>
            {products.map((p) => (
              <div
                key={p.name + p.href}
                data-stack="card"
                className="w-[260px] shrink-0 snap-start sm:w-[280px]"
              >
                <VerticalCard {...railToVerticalProps(p)} />
              </div>
            ))}
            {endLink && (
              <div className="w-[260px] shrink-0 snap-start sm:w-[280px]">
                <EndCard {...endLink} variant="scroll" />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/** Closing CTA card slotted at the end of a rail. */
function EndCard({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "grid" | "scroll";
}) {
  return (
    <Link
      to={href}
      className={cn(
        "group flex h-full flex-col items-center justify-center gap-5 rounded-2xl",
        "bg-paper-peach hover:bg-paper-rose lift-hover",
        "p-8 text-center transition-colors",
        variant === "scroll" && "min-h-[460px]",
      )}
    >
      <span
        aria-hidden
        className="bg-coral group-hover:bg-[var(--brand-hover)] flex size-16 items-center justify-center rounded-full transition-colors"
      >
        <ArrowRight className="size-7 text-white transition-transform group-hover:translate-x-0.5" />
      </span>
      <span className="text-fg-1 max-w-[200px] text-base font-semibold leading-snug">
        {label}
      </span>
      <span className="text-fg-3 text-xs">Prohlédnout celou kolekci →</span>
    </Link>
  );
}
