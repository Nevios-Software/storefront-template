import { cn } from "~/lib/utils";

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div";
  /**
   * Colour treatment. Default `muted` (fg-3) — matches the .eyebrow utility.
   *
   *   muted          — fg-3 on light surfaces (default)
   *   default        — fg-1 strong label
   *   coral          — coral brand emphasis
   *   on-dark        — white on dark/coral surfaces
   *   on-dark-muted  — white/70 on dark surfaces (de-emphasised label)
   */
  tone?: "muted" | "default" | "coral" | "on-dark" | "on-dark-muted";
  /** Vertical rhythm — default 0 (compose with utility margins). `sm` = mb-2, `md` = mb-5. */
  margin?: "none" | "sm" | "md";
}

const toneClass: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  muted: "", // .eyebrow already sets text-fg-3
  default: "!text-fg-1",
  coral: "!text-coral",
  "on-dark": "!text-white",
  "on-dark-muted": "!text-white/70",
};

const marginClass: Record<NonNullable<EyebrowProps["margin"]>, string> = {
  none: "",
  sm: "mb-2",
  md: "mb-5",
};

/** Small caps section label. 11px / 500 / 0.12em tracking / uppercase. */
export function Eyebrow({
  as: Component = "p",
  tone = "muted",
  margin = "none",
  className,
  ...props
}: EyebrowProps) {
  return (
    <Component
      className={cn("eyebrow", toneClass[tone], marginClass[margin], className)}
      {...props}
    />
  );
}
