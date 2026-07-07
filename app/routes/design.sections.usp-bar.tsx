import { Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { DesignShell, Specimen, PropsTable } from "~/design/design-shell";
import { UspBar } from "~/components/sections/usp-bar";

export function meta() {
  return [{ title: "USP Bar — /design" }];
}

export default function UspBarSpecimen() {
  return (
    <DesignShell
      activeGroup="sections"
      activeSlug="usp-bar"
      title="USP Bar"
      description="Trust-badge strip — free shipping, returns, secure payment, support. 2-up on mobile, 4-up on desktop."
    >
      <Specimen>
        <UspBar
          items={[
            { icon: Truck, label: "Doprava zdarma", description: "Při objednávce nad 999 Kč" },
            { icon: RotateCcw, label: "30 dní na vrácení", description: "Bez udání důvodu" },
            { icon: ShieldCheck, label: "Bezpečná platba", description: "Karta, převod, na dobírku" },
            { icon: Headset, label: "Zákaznická podpora", description: "Jsme tu pro vás 7 dní v týdnu" },
          ]}
        />
      </Specimen>
      <PropsTable
        rows={[
          { name: "items", type: "UspItem[]", description: "icon (lucide), label, description?." },
        ]}
      />
    </DesignShell>
  );
}
