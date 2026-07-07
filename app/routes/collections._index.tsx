import { Link } from "react-router";
import type { Collection } from "@nevios/storefront-js";

import type { Route } from "./+types/collections._index";
import { getServerClient } from "../lib/nevios.server";
import { MediaImage } from "../components/shared/media-image";
import { shop } from "../../nevios.config";

export function meta() {
  return [{ title: `Kolekce · ${shop.name}` }];
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  };
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { client } = await getServerClient(request, context.cloudflare.env);
  const list = await client.catalog.collections({ limit: 48 }).catch((err) => {
    console.error("collections load failed", err);
    return { collections: [] as Collection[], total_count: 0 };
  });
  return { collections: list.collections };
}

/** Collections index — every published collection as a card. */
export default function CollectionsIndexRoute({ loaderData }: Route.ComponentProps) {
  const { collections } = loaderData;

  return (
    <div className="section-wide py-8 lg:py-12">
      <header className="mb-8 max-w-xl">
        <p className="eyebrow mb-2">Katalog</p>
        <h1 className="text-3xl font-bold text-fg-1 sm:text-4xl">Kolekce</h1>
      </header>

      {collections.length === 0 ? (
        <div className="rounded-2xl bg-paper-cream-soft px-6 py-16 text-center">
          <p className="font-semibold text-fg-1">Zatím tu nejsou žádné kolekce.</p>
          <p className="mt-1 text-sm text-fg-3">Kolekce se spravují v Nevios dashboardu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              to={`/collections/${c.handle}`}
              className="lift-hover group overflow-hidden rounded-2xl bg-paper-cream-soft ring-1 ring-inset ring-[var(--hairline-soft)]"
            >
              <div className="relative aspect-square overflow-hidden bg-paper-cream">
                <MediaImage
                  src={c.image_url}
                  alt={c.title}
                  widths={[320, 640]}
                  sizes="(min-width: 640px) 300px, 45vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-slow group-hover:scale-[1.03]"
                />
              </div>
              <p className="px-4 py-3 text-sm font-semibold text-fg-1">{c.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
