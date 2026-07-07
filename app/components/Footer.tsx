import { Link } from "react-router";

import { shop } from "../../nevios.config";

export function Footer() {
  return (
    <footer className="surface-dark mt-20">
      <div className="section-bb grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-xs">
          <span className="font-display text-2xl font-bold tracking-tight text-fg-on-dark">
            {shop.name}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-fg-on-dark-muted">
            Vyrobeno s péčí, doručeno rychle.
          </p>
        </div>

        {/* Shop column renders only when nav items exist — an empty heading looks broken. */}
        {shop.nav.length > 0 && (
          <nav className="flex flex-col gap-2.5">
            <p className="mb-1 text-xs font-medium tracking-wide text-fg-on-dark-muted uppercase">Obchod</p>
            {shop.nav.map((item) => (
              <Link
                key={item.handle}
                to={`/collections/${item.handle}`}
                className="text-sm text-fg-on-dark/85 transition-colors duration-base hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <nav className="flex flex-col gap-2.5">
          <p className="mb-1 text-xs font-medium tracking-wide text-fg-on-dark-muted uppercase">Informace</p>
          {[
            { href: "/o-nas", label: "O nás" },
            { href: "/doprava", label: "Doprava a platba" },
            { href: "/kontakt", label: "Kontakt" },
            { href: "/obchodni-podminky", label: "Obchodní podmínky" },
          ].map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm text-fg-on-dark/85 transition-colors duration-base hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-[var(--hairline-on-dark)]">
        <div className="section-bb flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-fg-on-dark-muted">
          <span>© {new Date().getFullYear()} {shop.name}</span>
          <span>
            powered by{" "}
            <a href="https://nevios.io" target="_blank" rel="noreferrer" className="text-fg-on-dark/85 hover:text-white">
              Nevios
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
