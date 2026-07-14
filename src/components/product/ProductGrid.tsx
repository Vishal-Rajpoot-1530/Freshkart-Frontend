import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <div className="text-center py-16 text-muted-foreground">No products found.</div>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div className="min-w-0">
        <h2 className="font-display text-xl sm:text-2xl font-black truncate">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
      </div>
      {href && (
        <a href={href} className="shrink-0 text-sm font-semibold text-primary hover:underline">See all →</a>
      )}
    </div>
  );
}
