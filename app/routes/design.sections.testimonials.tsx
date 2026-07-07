import { DesignShell, Specimen, PropsTable } from "~/design/design-shell";
import { Testimonials } from "~/components/sections/testimonials";

export function meta() {
  return [{ title: "Testimonials — /design" }];
}

export default function TestimonialsSpecimen() {
  return (
    <DesignShell
      activeGroup="sections"
      activeSlug="testimonials"
      title="Testimonials"
      description="Customer-quote grid with an optional 0-5 star rating row."
    >
      <Specimen>
        <Testimonials
          eyebrow="Recenze"
          title="Co říkají zákazníci"
          testimonials={[
            { name: "Jana K.", quote: "Objednávka dorazila druhý den a balení bylo perfektní.", rating: 5 },
            { name: "Tomáš V.", quote: "Kvalita přesně podle popisu, komunikace bezproblémová.", rating: 5 },
            { name: "Petra S.", quote: "Vrácení proběhlo hladce, žádné zbytečné papírování.", rating: 4 },
          ]}
        />
      </Specimen>
      <PropsTable
        rows={[
          { name: "testimonials", type: "Testimonial[]", description: "name, quote, rating? (0-5), role?." },
          { name: "eyebrow, title, description", type: "string", description: "Section header." },
        ]}
      />
    </DesignShell>
  );
}
