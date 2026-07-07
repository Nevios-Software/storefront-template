import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";

export interface HeroSlide {
  /** Pre-title eyebrow (small, optional). */
  eyebrow?: string;
  /** Big display title — pass JSX for line breaks/highlight. */
  title: React.ReactNode;
  /** Body text under title. */
  description?: React.ReactNode;
  ctaLabel: string;
  ctaHref: string;
  /** Background tone — picks the gradient. Default = coral. */
  tone?: "coral" | "peach" | "soil" | "cream";
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  className?: string;
  /** Auto-advance interval in ms. Set 0 to disable. Default 7000. */
  autoAdvanceMs?: number;
}

const toneClass: Record<NonNullable<HeroSlide["tone"]>, string> = {
  coral: "grad-sunset text-white",
  peach: "bg-paper-peach text-fg-1",
  soil: "grad-soil text-white",
  cream: "bg-paper-cream-soft text-fg-1",
};

const ctaToneClass: Record<NonNullable<HeroSlide["tone"]>, string> = {
  coral: "bg-card text-fg-1 hover:bg-paper-cream-soft",
  peach: "bg-coral text-white hover:bg-[var(--brand-hover)]",
  soil: "bg-card text-fg-1 hover:bg-paper-cream-soft",
  cream: "bg-coral text-white hover:bg-[var(--brand-hover)]",
};

/**
 * Hero carousel — full-width gradient slides with display title, description,
 * white pill CTA, and arrow nav. Uses CSS scroll-snap (no library). Ported
 * verbatim from the Bodybe Next store; only the framework seams changed.
 */
export function HeroCarousel({ slides, className, autoAdvanceMs = 7000 }: HeroCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const goTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstSlide = el.firstElementChild as HTMLElement | null;
    if (!firstSlide) return;
    const slideStride = firstSlide.offsetWidth + parseFloat(getComputedStyle(el).gap || "0");
    el.scrollTo({ left: idx * slideStride, behavior: "smooth" });
    setActiveIdx(idx);
  };

  const prev = () => goTo(activeIdx === 0 ? slides.length - 1 : activeIdx - 1);
  const next = () => goTo(activeIdx === slides.length - 1 ? 0 : activeIdx + 1);

  // Force initial scroll to slide 0 before paint.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = 0;
  }, []);

  // Auto-advance — pauses on user interaction (debounces via activeIdx dep)
  useEffect(() => {
    if (autoAdvanceMs <= 0 || slides.length <= 1) return;
    const id = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const firstSlide = el.firstElementChild as HTMLElement | null;
      if (!firstSlide) return;
      const slideStride = firstSlide.offsetWidth + parseFloat(getComputedStyle(el).gap || "0");
      const nextIdx = activeIdx === slides.length - 1 ? 0 : activeIdx + 1;
      el.scrollTo({ left: nextIdx * slideStride, behavior: "smooth" });
      setActiveIdx(nextIdx);
    }, autoAdvanceMs);
    return () => clearTimeout(id);
  }, [activeIdx, autoAdvanceMs, slides.length]);

  return (
    <div className={cn("relative", className)}>
      {/* Scroll container — edge-to-edge with peek of adjacent slides on sides */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 scroll-px-4 sm:gap-4 sm:px-6 sm:scroll-px-6 lg:gap-5 lg:px-8 lg:scroll-px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget;
          const firstSlide = el.firstElementChild as HTMLElement | null;
          if (!firstSlide) return;
          const slideStride = firstSlide.offsetWidth + parseFloat(getComputedStyle(el).gap || "0");
          const newIdx = Math.round(el.scrollLeft / slideStride);
          if (newIdx !== activeIdx && newIdx >= 0 && newIdx < slides.length) {
            setActiveIdx(newIdx);
          }
        }}
      >
        {slides.map((slide, i) => {
          const tone = slide.tone ?? "coral";
          return (
            <article
              key={i}
              className={cn(
                "relative flex shrink-0 snap-center flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl px-5 py-12 text-center sm:px-12 sm:py-16 lg:py-24",
                "min-h-[440px] sm:min-h-[520px] lg:min-h-[560px]",
                "w-[calc(100vw-2rem)] sm:w-[88vw] lg:w-[min(1400px,86vw)]",
                toneClass[tone],
              )}
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} z ${slides.length}`}
            >
              {slide.eyebrow && (
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-widest",
                    tone === "coral" || tone === "soil" ? "text-white/80" : "text-fg-3",
                  )}
                >
                  {slide.eyebrow}
                </p>
              )}
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              {slide.description && (
                <p
                  className={cn(
                    "max-w-xl text-base sm:text-lg",
                    tone === "coral" || tone === "soil" ? "text-white/90" : "text-fg-2",
                  )}
                >
                  {slide.description}
                </p>
              )}
              <Link
                to={slide.ctaHref}
                className={cn(
                  "rounded-pill mt-2 inline-flex items-center px-7 py-3.5 text-base font-semibold transition-colors",
                  ctaToneClass[tone],
                )}
              >
                {slide.ctaLabel}
              </Link>
            </article>
          );
        })}
      </div>

      {/* Arrow buttons — hidden on touch */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Předchozí slide"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Další slide"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:flex"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Dots */}
          <div
            role="tablist"
            aria-label="Slidery"
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Přejít na slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full bg-white/40 transition-all hover:bg-white/60",
                  i === activeIdx ? "w-8 bg-white" : "w-1.5",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
