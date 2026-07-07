import { ContentPage } from "~/components/shared/content-page";
import { shop } from "../../nevios.config";

export function meta() {
  return [{ title: `O nás · ${shop.name}` }];
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" };
}

/** About page — replace this placeholder copy with the store's real story. */
export default function AboutRoute() {
  return (
    <ContentPage eyebrow="Náš příběh" title="O nás">
      <p>
        Jsme malý tým, který věří, že nakupování má být jednoduché a férové. Každý produkt v
        nabídce sami vybíráme a testujeme — prodáváme jen to, co bychom sami používali.
      </p>
      <p>
        Objednávky balíme s péčí a expedujeme zpravidla do 24 hodin. Kdykoli si nebudete jistí,
        napište nám — odpovídáme rychle a rádi poradíme.
      </p>
    </ContentPage>
  );
}
