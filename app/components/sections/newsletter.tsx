import { cn } from "~/lib/utils";
import { Eyebrow } from "~/components/shared/eyebrow";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface NewsletterProps {
  eyebrow?: string;
  title: string;
  description?: string;
  placeholder?: string;
  ctaLabel?: string;
  /**
   * Form action URL. Nevios doesn't run a mailing list itself — point this at
   * your ESP's signup endpoint (Klaviyo, Mailchimp, Brevo...) or a Nevios
   * function you add yourself. Left empty, the form still renders but submits
   * nowhere — wire it before shipping.
   */
  action?: string;
  tone?: "dark" | "cream";
  className?: string;
}

/** Email-capture strip — dark or tinted surface, centered form. */
export function Newsletter({
  eyebrow,
  title,
  description,
  placeholder = "vas@email.cz",
  ctaLabel = "Přihlásit se",
  action,
  tone = "dark",
  className,
}: NewsletterProps) {
  const isDark = tone === "dark";
  return (
    <section
      className={cn(
        "rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16",
        isDark ? "bg-paper-dark text-fg-on-dark" : "bg-paper-cream-soft text-fg-1",
        className,
      )}
    >
      <div className="mx-auto max-w-lg">
        {eyebrow && (
          <Eyebrow tone={isDark ? "on-dark-muted" : "muted"} margin="sm" className="flex justify-center">
            {eyebrow}
          </Eyebrow>
        )}
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        {description && (
          <p className={cn("mt-2 text-sm", isDark ? "text-fg-on-dark-muted" : "text-fg-2")}>
            {description}
          </p>
        )}
        <form method="post" action={action} className="mt-6 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">
            E-mailová adresa
          </label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder={placeholder}
            className={cn("flex-1", isDark && "border-white/20 bg-white text-fg-1 placeholder:text-fg-3")}
          />
          <Button type="submit" size="lg" className={isDark ? "bg-white text-fg-1 hover:bg-white/90" : undefined}>
            {ctaLabel}
          </Button>
        </form>
      </div>
    </section>
  );
}
