import { DesignShell, Specimen, PropsTable } from "~/design/design-shell";
import { Faq } from "~/components/sections/faq";

export function meta() {
  return [{ title: "FAQ — /design" }];
}

export default function FaqSpecimen() {
  return (
    <DesignShell
      activeGroup="sections"
      activeSlug="faq"
      title="FAQ"
      description="Accordion FAQ — one panel open at a time (shadcn Accordion underneath)."
    >
      <Specimen>
        <Faq
          eyebrow="Časté dotazy"
          title="Než objednáte"
          items={[
            { question: "Jak dlouho trvá doručení?", answer: "Standardní doručení trvá 1–3 pracovní dny." },
            { question: "Můžu zboží vrátit?", answer: "Ano, do 30 dnů od doručení bez udání důvodu." },
          ]}
        />
      </Specimen>
      <PropsTable
        rows={[
          { name: "items", type: "FaqItem[]", description: "question, answer (string or JSX)." },
        ]}
      />
    </DesignShell>
  );
}
