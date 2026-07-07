import { useState } from "react";
import type { ProductMedia } from "@nevios/storefront-js";

import { cn } from "~/lib/utils";
import { MediaImage } from "~/components/shared/media-image";

interface ProductGalleryProps {
  media: ProductMedia[];
  alt?: string;
  className?: string;
}

/**
 * PDP image gallery — main image + thumbnail strip. Every image (main and
 * thumbnails) goes through MediaImage, so a product with no photos yet shows
 * a clean placeholder instead of a broken image.
 */
export function ProductGallery({ media, alt, className }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const main = media[Math.min(active, media.length - 1)];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper-cream-soft ring-1 ring-inset ring-[var(--hairline-soft)]">
        <MediaImage
          src={main?.url}
          alt={main?.alt || alt || ""}
          widths={[600, 900, 1200]}
          sizes="(min-width: 1024px) 600px, 100vw"
          className="absolute inset-0 h-full w-full object-contain p-6"
        />
      </div>
      {media.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {media.map((m, i) => (
            <button
              key={m.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Obrázek ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "size-14 shrink-0 overflow-hidden rounded-xl bg-paper-cream-soft ring-1 ring-inset transition-shadow",
                i === active ? "ring-2 ring-[var(--brand)]" : "ring-[var(--hairline)]",
              )}
            >
              <MediaImage src={m.url} alt={m.alt || ""} width={112} className="h-full w-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
