import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import { Search as SearchIcon, TrendingUp, History } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Search — FreshKart" }] }),
  component: SearchPage,
});

const popular = ["Milk", "Bananas", "Bread", "Eggs", "Coffee", "Chips", "Yogurt", "Chocolate"];

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const [query, setQuery] = useState(q);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const t = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t) || p.category.toLowerCase().includes(t));
  }, [query]);

  const suggestions = useMemo(() => {
    if (!query.trim() || results.length > 0) return [];
    return popular.filter((p) => p.toLowerCase().includes(query.toLowerCase()));
  }, [query, results.length]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <label className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 focus-within:border-primary shadow-soft">
          <SearchIcon className="size-5 text-muted-foreground" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products, brands, categories..." className="flex-1 bg-transparent outline-none" />
        </label>

        {!query.trim() && (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3"><TrendingUp className="size-4 text-primary" /> Popular searches</div>
              <div className="flex flex-wrap gap-2">
                {popular.map((s) => (
                  <button key={s} onClick={() => setQuery(s)} className="rounded-full border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-3"><History className="size-4 text-primary" /> Recent</div>
              <div className="flex flex-wrap gap-2">
                {["Coffee", "Bread"].map((s) => (
                  <button key={s} onClick={() => setQuery(s)} className="rounded-full bg-muted px-3 py-1.5 text-sm">{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {query.trim() && (
          <div className="mt-6">
            {results.length > 0 ? (
              <>
                <div className="text-sm text-muted-foreground mb-4">{results.length} results for "<span className="text-foreground font-semibold">{query}</span>"</div>
                <ProductGrid products={results} />
              </>
            ) : (
              <div className="py-16 text-center">
                <div className="text-6xl">🔍</div>
                <h2 className="mt-4 font-display font-black text-2xl">No results for "{query}"</h2>
                <p className="mt-2 text-sm text-muted-foreground">Try one of these instead:</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {(suggestions.length ? suggestions : popular).map((s) => (
                    <button key={s} onClick={() => setQuery(s)} className="rounded-full border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">{s}</button>
                  ))}
                </div>
                <Link to="/" className="mt-6 inline-block text-sm text-primary underline">Back to home</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
