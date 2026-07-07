import { DesignShell, Specimen, PropsTable } from "~/design/design-shell";
import { MediaText } from "~/components/sections/media-text";

export function meta() {
  return [{ title: "Media + Text — /design" }];
}

export default function MediaTextSpecimen() {
  return (
    <DesignShell
      activeGroup="sections"
      activeSlug="media-text"
      title="Media + Text"
      description="Image + copy banner for brand story or category spotlight. Missing image → neutral placeholder, never broken."
    >
      <Specimen>
        <MediaText
          eyebrow="Náš příběh"
          title="Vyrobeno s péčí, doručeno rychle."
          description="Od výběru materiálů po zabalení poslední objednávky — na každém kroku nám záleží na detailu."
          ctaLabel="Více o nás"
          ctaHref="#"
          tone="cream"
        />
      </Specimen>
      <PropsTable
        rows={[
          { name: "image / imageAlt", type: "string", description: "Nevios Media CDN URL — never a local /public path." },
          { name: "reverse", type: "boolean", description: "Image on the right instead of the left (desktop)." },
          { name: "tone", type: '"cream" | "peach" | "transparent"', default: '"transparent"', description: "Section background." },
        ]}
      />
    </DesignShell>
  );
}
