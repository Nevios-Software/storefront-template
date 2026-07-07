import { DesignShell, Specimen, PropsTable, RuleBox } from "~/design/design-shell";
import { MediaImage } from "~/components/shared/media-image";

export function meta() {
  return [{ title: "Media Image — /design" }];
}

export default function MediaImageSpecimen() {
  return (
    <DesignShell
      activeGroup="shared"
      activeSlug="media-image"
      title="Media Image"
      description="The template's <img> replacement. Empty or missing src renders a neutral placeholder — a product without a photo never shows a broken image icon."
    >
      <Specimen className="grid max-w-md grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-fg-3">src = "" (placeholder)</p>
          <MediaImage src="" alt="Bez obrázku" className="aspect-square w-full rounded-xl object-cover" />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-fg-3">s reálným URL</p>
          <MediaImage
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e8e6e1'/%3E%3Ccircle cx='50' cy='42' r='18' fill='%238f8b83'/%3E%3C/svg%3E"
            alt="Ukázka"
            className="aspect-square w-full rounded-xl object-cover"
          />
        </div>
      </Specimen>
      <PropsTable
        rows={[
          { name: "src", type: "string | null | undefined", description: "Nevios Media CDN URL. Falsy → placeholder branch." },
          { name: "alt", type: "string", description: "Used on both branches (aria-label on the placeholder)." },
          { name: "className", type: "string", description: "Sizing/position — applied identically to both branches." },
        ]}
      />
      <RuleBox>
        Every image surface in this template goes through <code>MediaImage</code> — never a bare{" "}
        <code>&lt;img&gt;</code> for catalog/media content.
      </RuleBox>
    </DesignShell>
  );
}
