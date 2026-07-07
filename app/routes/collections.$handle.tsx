import { data, Form, Link, useSearchParams } from "react-router";
import { ChevronRight } from "lucide-react";
import { StorefrontError, type ProductSort } from "@nevios/storefront-js";

import type { Route } from "./+types/collections.$handle";
import { getServerClient } from "../lib/nevios.server";
import { productToRailItem } from "../lib/product-to-rail";
import { railToVerticalProps } from "../components/sections/product-rail";
import { VerticalCard } from "../components/product/vertical-card";
import { Pagination } from "../components/shared/pagination";
import { shop } from "../../nevios.config";

const PAGE_SIZE = 12;

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Nejnovější" },
  { value: "price-asc", label: "Od nejlevnějších" },
  { value: "price-desc", label: "Od nejdražších" },
  { value: "title-asc", label: "Název A–Z" },
];

export function meta({ data: d }: Route.MetaArgs) {
  return [{ title: d?.collection ? `${d.collection.title} · ${shop.name}` : shop.name }];
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  };
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { client } = await getServerClient(request, context.cloudflare.env);
  const u = new URL(request.url);
  const page = Math.max(1, Number(u.searchParams.get("page")) || 1);
  const sortParam = u.searchParams.get("sort");
  const sort: ProductSort = SORTS.some((s) => s.value === sortParam)
    ? (sortParam as ProductSort)
    : "newest";
  try {
    // Collection = presentation meta; the product page/sort itself comes from
    // the products list endpoint so pagination + sorting stay server-driven.
    const [collection, list] = await Promise.all([
      client.catalog.collection(params.handle),
      client.catalog.products({
        collection: params.handle,
        sort,
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    ]);
    return { collection, products: list.products, total: list.total_count, page, sort };
  } catch (err) {
    if (err instanceof StorefrontError && err.code === "not_found") {
      throw data("Collection not found", { status: 404 });
    }
    throw err;
  }
}

/** Collection listing — header, sort, product grid, pagination. All URL-driven (SSR). */
export default function CollectionRoute({ loaderData }: Route.ComponentProps) {
  const { collection, products, total, page, sort } = loaderData;
  const [searchParams] = useSearchParams();

  return (
    <div className="section-wide py-8 lg:py-12">
      <nav aria-label="Drobečková navigace" className="mb-6 flex items-center gap-1.5 text-xs text-fg-3">
        <Link to="/" className="transition-colors hover:text-fg-1">
          Domů
        </Link>
        <ChevronRight className="size-3" aria-hidden />
        <Link to="/collections" className="transition-colors hover:text-fg-1">
          Kolekce
        </Link>
        <ChevronRight className="size-3" aria-hidden />
        <span className="text-fg-1">{collection.title}</span>
      </nav>

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-fg-1 sm:text-4xl">{collection.title}</h1>
          {collection.description_html && (
            <div
              className="mt-2 text-sm text-fg-2"
              dangerouslySetInnerHTML={{ __html: collection.description_html }}
            />
          )}
          <p className="num mt-2 text-xs text-fg-3">{total} produktů</p>
        </div>

        {/* Sort — plain GET form → URL param → SSR re-render. */}
        <Form method="get" className="flex items-center gap-2">
          {searchParams.get("page") && <input type="hidden" name="page" value="1" />}
          <label htmlFor="sort" className="text-xs font-medium text-fg-3">
            Řadit
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="h-9 rounded-pill bg-paper-cream-soft px-3 text-sm font-medium text-fg-1 ring-1 ring-inset ring-[var(--hairline)] outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Form>
      </header>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-paper-cream-soft px-6 py-16 text-center">
          <p className="font-semibold text-fg-1">V této kolekci zatím nejsou žádné produkty.</p>
          <p className="mt-1 text-sm text-fg-3">Zkuste se podívat později, nebo prozkoumejte ostatní kolekce.</p>
          <Link
            to="/collections"
            className="mt-5 inline-flex rounded-pill bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Všechny kolekce
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <VerticalCard key={p.id} {...railToVerticalProps(productToRailItem(p))} />
            ))}
          </div>
          <Pagination total={total} pageSize={PAGE_SIZE} page={page} className="mt-10" />
        </>
      )}
    </div>
  );
}
