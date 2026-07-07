import { ContentPage } from "~/components/shared/content-page";
import { shop } from "../../nevios.config";

export function meta() {
  return [{ title: `Obchodní podmínky · ${shop.name}` }];
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" };
}

/** Terms — PLACEHOLDER. Replace with the store's real, legally reviewed terms before launch. */
export default function TermsRoute() {
  return (
    <ContentPage eyebrow="Právní informace" title="Obchodní podmínky">
      <p>
        Toto je zástupný text. Před spuštěním obchodu sem vložte skutečné obchodní podmínky —
        ideálně po konzultaci s právníkem.
      </p>
      <h2>1. Základní ustanovení</h2>
      <p>Identifikace prodávajícího, kontaktní údaje, vymezení pojmů.</p>
      <h2>2. Objednávka a uzavření smlouvy</h2>
      <p>Jak vzniká kupní smlouva, ceny, platnost nabídky.</p>
      <h2>3. Doprava, platba a dodání</h2>
      <p>Způsoby doručení a platby, dodací lhůty.</p>
      <h2>4. Odstoupení od smlouvy a reklamace</h2>
      <p>Lhůty a postup pro vrácení zboží a reklamace.</p>
    </ContentPage>
  );
}
