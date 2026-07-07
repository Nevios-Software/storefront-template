import type { ReactNode } from "react";
import { Link } from "react-router";

import { cn } from "~/lib/utils";
import { registry, designPath, type DesignGroup } from "./registry";

const GROUP_LABEL: Record<DesignGroup, string> = {
  sections: "Sections",
  product: "Product",
  shared: "Shared",
  primitives: "Primitives",
};

/** Chrome for every /design/* page — sidebar nav (from the registry) + content. */
export function DesignShell({
  activeGroup,
  activeSlug,
  title,
  description,
  children,
}: {
  activeGroup?: DesignGroup;
  activeSlug?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const groups: DesignGroup[] = ["sections", "product", "shared", "primitives"];
  return (
    <div className="section-wide grid gap-8 py-8 lg:grid-cols-[220px_1fr] lg:gap-12">
      <nav aria-label="Design registry" className="lg:sticky lg:top-24 lg:self-start">
        <Link to="/design" className="text-sm font-bold text-fg-1">
          /design
        </Link>
        <div className="mt-4 flex flex-col gap-5">
          {groups.map((g) => (
            <div key={g}>
              <p className="eyebrow mb-2">{GROUP_LABEL[g]}</p>
              <ul className="flex flex-col gap-1">
                {registry
                  .filter((e) => e.group === g)
                  .map((e) => (
                    <li key={e.slug}>
                      <Link
                        to={designPath(e)}
                        className={cn(
                          "block rounded-md px-2 py-1 text-sm transition-colors",
                          activeGroup === g && activeSlug === e.slug
                            ? "bg-paper-cream-soft font-semibold text-fg-1"
                            : "text-fg-3 hover:text-fg-1",
                        )}
                      >
                        {e.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      <div className="min-w-0">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-fg-1 sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm text-fg-2">{description}</p>}
        </header>
        {children}
      </div>
    </div>
  );
}

/** Live-demo frame — a neutral canvas so the component reads on its own. */
export function Specimen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-page p-6 ring-1 ring-inset ring-[var(--hairline)] sm:p-10", className)}>
      {children}
    </div>
  );
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** Typed-props reference table — the contract an AI (or dev) reads before using a section. */
export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl ring-1 ring-inset ring-[var(--hairline)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--hairline)] bg-paper-cream-soft">
            <th className="px-4 py-2 font-semibold text-fg-1">Prop</th>
            <th className="px-4 py-2 font-semibold text-fg-1">Type</th>
            <th className="px-4 py-2 font-semibold text-fg-1">Default</th>
            <th className="px-4 py-2 font-semibold text-fg-1">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-[var(--hairline-soft)] last:border-0">
              <td className="num px-4 py-2 font-mono text-xs text-fg-1">{r.name}</td>
              <td className="num px-4 py-2 font-mono text-xs text-fg-3">{r.type}</td>
              <td className="num px-4 py-2 font-mono text-xs text-fg-3">{r.default ?? "—"}</td>
              <td className="px-4 py-2 text-fg-2">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A short usage/guardrail note under a specimen. */
export function RuleBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-xl bg-paper-peach px-4 py-3 text-sm text-fg-2">{children}</div>
  );
}
