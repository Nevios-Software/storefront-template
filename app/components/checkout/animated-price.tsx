import { formatCents } from "@nevios/storefront-kit";

import { cn } from "~/lib/utils";

/**
 * A money figure that slides in when its value changes — the app.css rule
 * "měnící se čísla se animují": the formatted string is the key, so a new
 * value re-mounts the inner span and `.num-roll` slides it up from below.
 * Honors prefers-reduced-motion (the utility disables itself).
 */
export function AnimatedPrice({
  cents,
  currency,
  locale,
  className,
}: {
  cents: number;
  currency: string;
  locale?: string;
  className?: string;
}) {
  const text = formatCents(cents, currency, locale);
  return (
    <span className={cn("num inline-flex overflow-hidden", className)}>
      <span key={text} className="num-roll whitespace-nowrap">
        {text}
      </span>
    </span>
  );
}
