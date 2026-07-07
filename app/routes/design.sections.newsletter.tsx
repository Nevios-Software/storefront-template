import { DesignShell, Specimen, PropsTable, RuleBox } from "~/design/design-shell";
import { Newsletter } from "~/components/sections/newsletter";

export function meta() {
  return [{ title: "Newsletter — /design" }];
}

export default function NewsletterSpecimen() {
  return (
    <DesignShell
      activeGroup="sections"
      activeSlug="newsletter"
      title="Newsletter"
      description="Email-capture strip — dark or tinted surface, centered form."
    >
      <Specimen>
        <Newsletter
          eyebrow="Buďte v obraze"
          title="Novinky a slevy přímo do e-mailu"
          description="Žádný spam — jen nové produkty a příležitostné akce."
        />
      </Specimen>
      <PropsTable
        rows={[
          { name: "action", type: "string", description: "Form action URL — your ESP's signup endpoint." },
          { name: "tone", type: '"dark" | "cream"', default: '"dark"', description: "Section surface." },
        ]}
      />
      <RuleBox>
        Nevios doesn't run a mailing list. Point <code>action</code> at Klaviyo/Mailchimp/Brevo
        (or your own function) before shipping — the form renders either way.
      </RuleBox>
    </DesignShell>
  );
}
