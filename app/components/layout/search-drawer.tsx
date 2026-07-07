import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { useStorefront, formatCents } from "@nevios/storefront-kit";
import type { Product } from "@nevios/storefront-js";

import { useMarketData } from "~/lib/market";
import { MediaImage } from "~/components/shared/media-image";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet";

/**
 * Search drawer — slides in from the top. Debounced live results (top 5) as
 * you type; Enter or "Všechny výsledky" goes to the full /search page.
 */
export function SearchDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const client = useStorefront();
  const navigate = useNavigate();
  const { locale } = useMarketData();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced live search — cancel the previous timer on every keystroke.
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounce.current = setTimeout(async () => {
      try {
        const list = await client.catalog.products({ q: term, limit: 5 });
        setResults(list.products);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [q, client]);

  const goToFullSearch = () => {
    const term = q.trim();
    if (!term) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          setQ("");
          setResults([]);
        }
      }}
    >
      <SheetContent side="top" className="border-b-0 bg-card pb-6">
        <SheetHeader className="sr-only">
          <SheetTitle>Hledání</SheetTitle>
        </SheetHeader>
        <div className="section-prose w-full pt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToFullSearch();
            }}
            className="relative"
          >
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-fg-3" />
            <label htmlFor="drawer-search" className="sr-only">
              Hledaný výraz
            </label>
            <Input
              id="drawer-search"
              type="search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Co hledáte?"
              className="h-12 rounded-pill pl-11 text-base"
            />
            {searching && (
              <Loader2 className="absolute top-1/2 right-4 size-4.5 -translate-y-1/2 animate-spin text-fg-3" />
            )}
          </form>

          {results.length > 0 && (
            <ul className="fade-in mt-4 flex flex-col gap-1">
              {results.map((p) => {
                const money = p.variants[0]?.price;
                return (
                  <li key={p.id}>
                    <Link
                      to={`/products/${p.handle}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-base hover:bg-paper-cream-soft"
                    >
                      <span className="block size-12 shrink-0 overflow-hidden rounded-lg bg-paper-cream">
                        <MediaImage
                          src={p.media[0]?.url}
                          alt=""
                          width={96}
                          className="h-full w-full object-contain p-1"
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg-1">
                        {p.title}
                      </span>
                      {money && (
                        <span className="num text-sm font-bold text-fg-1">
                          {formatCents(money.amount_cents, money.currency, locale)}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={goToFullSearch}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-pill py-2.5 text-sm font-semibold text-fg-2 transition-colors duration-base hover:bg-paper-cream-soft hover:text-fg-1"
                >
                  Všechny výsledky <ArrowRight className="size-4" />
                </button>
              </li>
            </ul>
          )}
          {q.trim().length >= 2 && !searching && results.length === 0 && (
            <p className="fade-in mt-4 text-center text-sm text-fg-3">
              Pro „{q.trim()}" jsme nic nenašli.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
