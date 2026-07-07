import * as React from "react";

import { cn } from "~/lib/utils";

/**
 * Smooth height reveal via the grid-rows trick: the wrapper animates
 * `grid-template-rows` 0fr → 1fr, the inner div clips with overflow-hidden.
 * No measured heights, works for any content. Closed content is `inert`
 * (unfocusable + hidden from AT). Reduced motion → no transition.
 */
export function Reveal({
  open,
  children,
  className,
}: {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-slow ease-spring-soft motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden" inert={!open}>
        {children}
      </div>
    </div>
  );
}
