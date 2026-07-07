import { Check } from "lucide-react";

import { cn } from "~/lib/utils";

export type CheckoutStep = "address" | "shipping" | "payment";

export const CHECKOUT_STEPS: CheckoutStep[] = ["address", "shipping", "payment"];

export function stepRank(step: CheckoutStep): number {
  return CHECKOUT_STEPS.indexOf(step);
}

const STEP_LABELS: Record<CheckoutStep, string> = {
  address: "Adresa",
  shipping: "Doprava",
  payment: "Platba",
};

/**
 * Animated 3-step indicator: a progress track fills between step dots as the
 * customer advances (CSS width transition), completed steps get a check and
 * are clickable to go back. Forward-skipping past the server state is never
 * allowed — `reached` is derived from what the checkout has filled in.
 */
export function CheckoutStepper({
  current,
  reached,
  onStepClick,
}: {
  current: CheckoutStep;
  reached: CheckoutStep;
  onStepClick: (step: CheckoutStep) => void;
}) {
  const cur = stepRank(current);
  const done = stepRank(reached);

  return (
    <nav aria-label="Kroky pokladny" className="relative">
      {/* Track — spans between the centers of the first and last dot. */}
      <div
        aria-hidden
        className="absolute inset-x-[calc(100%/6)] top-[17px] h-0.5 rounded-pill bg-[var(--hairline)]"
      />
      {/* Fill — animates width between steps. */}
      <div
        aria-hidden
        className="absolute left-[calc(100%/6)] top-[17px] h-0.5 rounded-pill bg-brand transition-[width] duration-slow ease-spring-soft motion-reduce:transition-none"
        style={{ width: `calc(100% / 3 * ${cur})` }}
      />
      <ol className="relative grid grid-cols-3">
        {CHECKOUT_STEPS.map((step, i) => {
          const isCurrent = step === current;
          const isCompleted = i < done && !isCurrent;
          const visitable = i <= done;
          return (
            <li key={step} className="flex justify-center">
              <button
                type="button"
                disabled={!visitable || isCurrent}
                onClick={() => visitable && onStepClick(step)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Krok ${i + 1}: ${STEP_LABELS[step]}`}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  visitable && !isCurrent && "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-[background-color,box-shadow,color] duration-base motion-reduce:transition-none",
                    isCurrent || isCompleted
                      ? "bg-brand text-white"
                      : "bg-card text-fg-3 ring-1 ring-inset ring-[var(--hairline-strong)]",
                    isCurrent && "shadow-[0_0_0_4px_color-mix(in_oklch,var(--brand)_14%,transparent)]",
                    isCompleted && "group-hover:bg-brand-hover",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 fade-in" strokeWidth={3} />
                  ) : (
                    <span className="num">{i + 1}</span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold transition-colors duration-base",
                    isCurrent ? "text-fg-1" : isCompleted ? "text-fg-2 group-hover:text-fg-1" : "text-fg-3",
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
