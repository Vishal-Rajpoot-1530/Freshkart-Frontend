import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categories, brands } from "@/data/categories";
import { products } from "@/data/products";
import { SlidersHorizontal, X } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return cat;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — FreshKart` : "Category — FreshKart" },
      { name: "description", content: loaderData ? `Shop ${loaderData.name.toLowerCase()} online with 10 minute delivery.` : "" },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <AppLayout><div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="font-display text-3xl font-black">Category not found</h1><Link to="/" className="mt-4 inline-block text-primary underline">Back to home</Link></div></AppLayout>
  ),
});

function CategoryPage() {
  const cat = Route.useLoaderData();
  const [sort, setSort] = useState("relevance");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.categorySlug === cat.slug);
    list = list.filter((p) => p.price <= maxPrice);
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "discount") list.sort((a, b) => b.discountPercent - a.discountPercent);
    return list;
  }, [cat.slug, sort, maxPrice, selectedBrands, minRating, inStockOnly]);

  const catBrands = Array.from(new Set(products.filter((p) => p.categorySlug === cat.slug).map((p) => p.brand)));

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Sort by</h3>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full rounded-lg border bg-card px-3 py-2 text-sm">
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
          <option value="rating">Highest rated</option>
          <option value="discount">Biggest discount</option>
        </select>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Price</h3>
        <input type="range" min={20} max={1000} step={10} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary" />
        <div className="text-xs text-muted-foreground mt-1">Up to ₹{maxPrice}</div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {(catBrands.length ? catBrands : brands).map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={selectedBrands.includes(b)} onChange={(e) => setSelectedBrands((cur) => e.target.checked ? [...cur, b] : cur.filter((x) => x !== b))} className="accent-primary size-4" />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Minimum rating</h3>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${minRating === r ? "border-primary bg-primary-soft text-primary" : ""}`}>
              {r === 0 ? "Any" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-primary size-4" />
        In stock only
      </label>
    </div>
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-xs text-muted-foreground mb-3">
          <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span> <span className="text-foreground font-medium">{cat.name}</span>
        </nav>
        <div className="flex items-center gap-4 mb-6">
          <div className="grid size-14 place-items-center rounded-2xl text-3xl shadow-soft" style={{ background: cat.color }}>{cat.emoji}</div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-black truncate">{cat.name}</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} products available</p>
          </div>
          <button onClick={() => setFiltersOpen(true)} className="lg:hidden ml-auto rounded-xl border px-3 py-2 text-sm font-semibold inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" /> Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <aside className="hidden lg:block rounded-2xl border bg-card p-5 h-fit sticky top-24">{filters}</aside>
          <div className="min-w-0"><ProductGrid products={filtered} /></div>
        </div>
      </div>

      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setFiltersOpen(false)}>
          <div className="absolute bottom-0 inset-x-0 max-h-[80dvh] bg-card rounded-t-3xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-lg">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}><X /></button>
            </div>
            {filters}
            <button onClick={() => setFiltersOpen(false)} className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">Show {filtered.length} results</button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
