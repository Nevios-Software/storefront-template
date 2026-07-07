import { Star } from "lucide-react";

import { cn } from "~/lib/utils";
import { Eyebrow } from "~/components/shared/eyebrow";

export interface Testimonial {
  name: string;
  quote: string;
  /** 0-5, optional — omit to hide the star row. */
  rating?: number;
  role?: string;
}

interface TestimonialsProps {
  eyebrow?: string;
  title: string;
  description?: string;
  testimonials: Testimonial[];
  className?: string;
}

/** Customer-quote grid — 1/2/3 columns by breakpoint. */
export function Testimonials({
  eyebrow,
  title,
  description,
  testimonials,
  className,
}: TestimonialsProps) {
  return (
    <section className={cn(className)}>
      <header className="mb-6 max-w-xl">
        {eyebrow && <Eyebrow margin="sm">{eyebrow}</Eyebrow>}
        <h2 className="text-2xl font-bold text-fg-1 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm text-fg-2">{description}</p>}
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure
            key={i}
            className="flex flex-col gap-4 rounded-2xl bg-paper-cream-soft p-6 ring-1 ring-inset ring-[var(--hairline-soft)]"
          >
            {typeof t.rating === "number" && (
              <div className="flex gap-0.5 text-[var(--warning)]" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="size-3.5"
                    strokeWidth={0}
                    fill={s < t.rating! ? "currentColor" : "var(--hairline-strong)"}
                  />
                ))}
              </div>
            )}
            <blockquote className="flex-1 text-sm leading-relaxed text-fg-2">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-peach text-sm font-semibold text-fg-1"
              >
                {t.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg-1">{t.name}</p>
                {t.role && <p className="truncate text-xs text-fg-3">{t.role}</p>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
