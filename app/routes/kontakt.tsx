import { ContentPage } from "~/components/shared/content-page";
import { shop } from "../../nevios.config";

export function meta() {
  return [{ title: `Kontakt · ${shop.name}` }];
}

export function headers() {
  return { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" };
}

/** Contact page — fill in the store's real e-mail, phone, and billing info. */
export default function ContactRoute() {
  return (
    <ContentPage eyebrow="Jsme tu pro vás" title="Kontakt">
      <p>
        Nejrychleji nás zastihnete e-mailem — odpovídáme obvykle do několika hodin v pracovní
        dny.
      </p>
      <ul>
        <li>E-mail: info@example.com</li>
        <li>Telefon: +420 000 000 000 (po–pá 9–17)</li>
      </ul>
      <h2>Fakturační údaje</h2>
      <p>Doplňte název společnosti, sídlo, IČO a DIČ.</p>
    </ContentPage>
  );
}
