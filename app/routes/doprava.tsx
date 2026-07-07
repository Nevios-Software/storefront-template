import { ContentPage } from "~/components/shared/content-page";
import { shop } from "../../nevios.config";

export function meta() {
  return [{ title: `Doprava a platba · ${shop.name}` }];
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" };
}

/** Shipping & payment info — keep in sync with the methods configured in the Nevios dashboard. */
export default function ShippingRoute() {
  return (
    <ContentPage eyebrow="Informace" title="Doprava a platba">
      <h2>Doprava</h2>
      <ul>
        <li>Doručení na adresu — 1–3 pracovní dny od odeslání.</li>
        <li>Výdejní místa — vyzvednutí zpravidla den po odeslání.</li>
        <li>Doprava zdarma při objednávce nad 999 Kč.</li>
      </ul>
      <h2>Platba</h2>
      <ul>
        <li>Platební kartou online.</li>
        <li>Bankovním převodem.</li>
        <li>Na dobírku při převzetí.</li>
      </ul>
      <h2>Vrácení zboží</h2>
      <p>
        Zboží můžete vrátit do 30 dnů od doručení bez udání důvodu. Stačí nám napsat a zboží
        poslat zpět — peníze vracíme do 14 dnů.
      </p>
    </ContentPage>
  );
}
