import type { ReactNode } from "react";
import { Link } from "react-router";

import { cn } from "~/lib/utils";
import { Eyebrow } from "~/components/shared/eyebrow";
import { MediaImage } from "~/components/shared/media-image";

interface MediaTextProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Image on the right instead of the left (desktop only). */
  reverse?: boolean;
  tone?: "cream" | "peach" | "transparent";
  className?: string;
}

/** Image + copy banner — brand story, category spotlight, editorial moments. */
export function MediaText({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  reverse,
  tone = "transparent",
  className,
}: MediaTextProps) {
  return (
    <section
      className={cn(
        "grid items-center gap-8 rounded-3xl lg:grid-cols-2 lg:gap-12",
        tone !== "transparent" && "p-6 sm:p-10",
        tone === "cream" && "bg-paper-cream-soft",
        tone === "peach" && "bg-paper-peach",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-4/3 overflow-hidden rounded-2xl bg-paper-cream",
          reverse && "lg:order-2",
        )}
      >
        <MediaImage
          src={image}
          alt={imageAlt || ""}
          widths={[640, 960, 1280]}
          sizes="(min-width: 1024px) 640px, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className={cn(reverse && "lg:order-1")}>
        {eyebrow && <Eyebrow margin="sm">{eyebrow}</Eyebrow>}
        <h2 className="text-2xl font-bold text-fg-1 sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-fg-2 sm:text-base">{description}</p>
        )}
        {ctaLabel && ctaHref && (
          <Link
            to={ctaHref}
            className="mt-6 inline-flex items-center gap-1.5 rounded-pill bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
