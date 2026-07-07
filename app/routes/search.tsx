import { Form, Link } from "react-router";
import { SearchIcon } from "lucide-react";
import type { Product } from "@nevios/storefront-js";

import type { Route } from "./+types/search";
import { getServerClient } from "../lib/nevios.server";
import { productToRailItem } from "../lib/product-to-rail";
import { railToVerticalProps } from "../components/sections/product-rail";
import { VerticalCard } from "../components/product/vertical-card";
import { Pagination } from "../components/shared/pagination";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { shop } from "../../nevios.config";

const PAGE_SIZE = 12;

export function meta({ data: d }: Route.MetaArgs) {
  return [
    { title: d?.q ? `„${d.q}" · ${shop.name}` : `Hledání · ${shop.name}` },
    // Search results shouldn't compete with catalog pages in indexes.
    { name: "robots", content: "noindex" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { client } = await getServerClient(request, context.cloudflare.env);
  const u = new URL(request.url);
  const q = (u.searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number(u.searchParams.get("page")) || 1);
  if (!q) return { q, products: [] as Product[], total: 0, page: 1 };
  const list = await client.catalog
    .products({ q, offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE })
    .catch((err) => {
      console.error("search failed", err);
      return { products: [] as Product[], total_count: 0 };
    });
  return { q, products: list.products, total: list.total_count, page };
}

/** Search — GET form drives the `q` URL param; results render server-side. */
export default function SearchRoute({ loaderData }: Route.ComponentProps) {
  const { q, products, total, page } = loaderData;

  return (
    <div className="section-wide py-8 lg:py-12">
      <header className="mx-auto mb-10 max-w-xl text-center">
        <h1 className="text-3xl font-bold text-fg-1 sm:text-4xl">Hledání</h1>
        <Form method="get" className="mt-5 flex gap-2">
          <label htmlFor="q" className="sr-only">
            Hledaný výraz
          </label>
          <Input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Co hledáte?"
            autoFocus
            className="flex-1"
          />
          <Button type="submit">
            <SearchIcon className="size-4" /> Hledat
          </Button>
        </Form>
      </header>

      {q === "" ? (
        <p className="text-center text-sm text-fg-3">Zadejte, co hledáte — prohledáme celý katalog.</p>
      ) : products.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl bg-paper-cream-soft px-6 py-14 text-center">
          <p className="font-semibold text-fg-1">Pro „{q}" jsme nic nenašli.</p>
          <p className="mt-1 text-sm text-fg-3">Zkuste jiný výraz, nebo projděte kolekce.</p>
          <Link
            to="/collections"
            className="mt-5 inline-flex rounded-pill bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Prohlédnout kolekce
          </Link>
        </div>
      ) : (
        <>
          <p className="num mb-4 text-sm text-fg-3">
            {total} výsledků pro „{q}"
          </p>
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
