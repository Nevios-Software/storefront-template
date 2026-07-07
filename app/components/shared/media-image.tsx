import { ImageOff } from "lucide-react";
import { image } from "@nevios/storefront-js";
import { useStorefrontOptional } from "@nevios/storefront-kit";

import { cn } from "~/lib/utils";

/**
 * Drop-in replacement for `<img>` that renders a neutral placeholder instead
 * of a broken-image icon when `src` is empty — every product/media surface in
 * this template goes through this so a product with no photo yet never looks
 * broken. Pass the exact className you'd give an `<img>` (sizing/position are
 * shared between both branches).
 *
 * When the store has a Cloudflare Image Resizing origin configured
 * (`client.imageBase`), pass `width`/`widths` and URLs are rewritten to
 * resized variants (+ a responsive srcSet). Without it these are safe no-ops
 * — the original URL passes through, so call sites never branch on config.
 */
export function MediaImage({
  src,
  alt = "",
  className,
  width,
  widths,
  sizes,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  /** Target render width in px (single resized variant). */
  width?: number;
  /** Render widths for a responsive srcSet (wins over `width` for candidates). */
  widths?: number[];
  /** `sizes` attribute to pair with `widths`. */
  sizes?: string;
}) {
  const base = useStorefrontOptional()?.imageBase;
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt || "Obrázek není k dispozici"}
        className={cn("flex items-center justify-center bg-paper-cream text-fg-4", className)}
      >
        <ImageOff className="size-8" strokeWidth={1.5} />
      </div>
    );
  }
  const candidates = widths?.length ? widths : width ? [width] : [];
  const srcSet = base
    ? candidates.map((w) => `${image(src, { base, width: w })} ${w}w`).join(", ")
    : "";
  return (
    <img
      src={image(src, { base, width: candidates.at(-1) })}
      srcSet={srcSet || undefined}
      sizes={srcSet && sizes ? sizes : undefined}
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
}
