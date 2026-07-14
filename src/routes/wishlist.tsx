import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — FreshKart" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { state } = useApp();
  const items = state.wishlist.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => !!p);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="font-display text-3xl font-black">Wishlist</h1>
        <p className="text-sm text-muted-foreground">{items.length} saved items</p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto grid size-24 place-items-center rounded-full bg-primary-soft"><Heart className="size-10 text-primary" /></div>
            <h2 className="mt-6 font-display text-xl font-black">Your wishlist is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">Save your favourite items for later</p>
            <Link to="/" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Explore products</Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
