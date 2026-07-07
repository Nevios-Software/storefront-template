import { Gift, Sparkles, Tag, TrendingUp } from "lucide-react";

import { DesignShell, Specimen, PropsTable, RuleBox } from "~/design/design-shell";
import { CategoryPills } from "~/components/sections/category-pills";

export function meta() {
  return [{ title: "Category Pills — /design" }];
}

export default function CategoryPillsSpecimen() {
  return (
    <DesignShell
      activeGroup="sections"
      activeSlug="category-pills"
      title="Category Pills"
      description="Quick-link pill grid — icon + label + arrow CTA. 2-up on mobile, 4-up on desktop."
    >
      <Specimen>
        <CategoryPills
          size="lg"
          pills={[
            { href: "#", label: "Novinky", icon: Sparkles },
            { href: "#", label: "Nejprodávanější", icon: TrendingUp },
            { href: "#", label: "Výprodej", icon: Tag },
            { href: "#", label: "Dárky", icon: Gift },
          ]}
        />
      </Specimen>
      <PropsTable
        rows={[
          { name: "pills", type: "CategoryPill[]", description: "href, label, icon (a lucide-react icon component)." },
          { name: "size", type: '"md" | "lg"', default: '"lg"', description: "Pill padding + icon size." },
        ]}
      />
      <RuleBox>Pick icons from <code>lucide-react</code> only — no emoji in production.</RuleBox>
    </DesignShell>
  );
}
