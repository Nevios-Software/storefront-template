import { Link } from "react-router";

import { registryByGroup, designPath, type DesignGroup } from "~/design/registry";

const GROUP_LABEL: Record<DesignGroup, string> = {
  sections: "Sections",
  product: "Product",
  shared: "Shared",
  primitives: "Primitives",
};

export function meta() {
  return [{ title: "/design" }];
}

/**
 * The design registry hub — every section/primitive registered in this store,
 * with a live specimen. This is the map an AI (or a person) reads before
 * building anything new: check here first, reuse before you reinvent.
 */
export default function DesignHub() {
  const groups: DesignGroup[] = ["sections", "product", "shared", "primitives"];
  return (
    <div className="section-wide py-10">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Design registry</p>
        <h1 className="text-3xl font-bold text-fg-1 sm:text-4xl">/design</h1>
        <p className="mt-3 text-sm text-fg-2 sm:text-base">
          Every section, product surface, and primitive this store ships with — live, not a
          markdown list that drifts. Adding something new? Look here first.
        </p>
      </header>
      {groups.map((g) => (
        <section key={g} className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-fg-1">{GROUP_LABEL[g]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {registryByGroup(g).map((e) => (
              <Link
                key={e.slug}
                to={designPath(e)}
                className="lift-hover block rounded-2xl bg-paper-cream-soft p-5 ring-1 ring-inset ring-[var(--hairline-soft)]"
              >
                <p className="font-semibold text-fg-1">{e.title}</p>
                <p className="mt-1 text-xs text-fg-3">{e.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
