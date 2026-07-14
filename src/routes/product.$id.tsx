import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, Star, Clock, Truck, ShieldCheck, Plus, Minus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/product/ProductGrid";
import { products, reviews, getProduct } from "@/data/products";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — FreshKart` : "Product — FreshKart" },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: loaderData?.name ?? "" },
      { property: "og:image", content: loaderData?.image ?? "" },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => <AppLayout><div className="py-24 text-center">Product not found. <Link to="/" className="text-primary underline">Home</Link></div></AppLayout>,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const { qty, add, inc, dec, toggleWish, isWished, view } = useApp();
  const quantity = qty(p.id);
  const wished = isWished(p.id);

  useEffect(() => { view(p.id); }, [p.id, view]);

  const related = products.filter((x) => x.categorySlug === p.categorySlug && x.id !== p.id).slice(0, 6);
  const fbt = products.filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span>
          <Link to="/category/$slug" params={{ slug: p.categorySlug }} className="hover:text-foreground">{p.category}</Link> <span className="mx-1">/</span>
          <span className="text-foreground">{p.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="rounded-3xl bg-surface p-6 sm:p-10 aspect-square grid place-items-center overflow-hidden">
              <motion.img key={p.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[p.image, p.image, p.image, p.image].map((src, i) => (
                <button key={i} className={`aspect-square rounded-xl border-2 bg-surface p-2 ${i === 0 ? "border-primary" : ""}`}>
                  <img src={src} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-md bg-primary-soft px-2 py-0.5 font-semibold text-primary">{p.brand}</span>
              {p.tags.map((t: string) => <span key={t} className="rounded-md bg-offer/20 px-2 py-0.5 font-semibold text-offer-foreground">{t}</span>)}
            </div>
            <h1 className="mt-2 font-display text-3xl font-black">{p.name}</h1>
            <div className="text-sm text-muted-foreground">{p.weight}</div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 rounded-md bg-primary-soft px-2 py-1 text-primary font-semibold">
                <Star className="size-3.5 fill-current" /> {p.rating.toFixed(1)}
              </div>
              <span className="text-muted-foreground">{p.reviews} ratings</span>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="size-3.5 text-primary" /> {p.deliveryMinutes} min delivery</span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <div className="text-3xl font-black">₹{p.price}</div>
              {p.originalPrice > p.price && (
                <>
                  <div className="text-lg text-muted-foreground line-through">₹{p.originalPrice}</div>
                  <div className="rounded-md bg-discount px-2 py-0.5 text-xs font-bold text-discount-foreground">{p.discountPercent}% OFF</div>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {quantity === 0 ? (
                <button onClick={() => { add(p.id); toast.success(`${p.name} added to cart`); }} disabled={!p.inStock} className="flex-1 min-w-[160px] rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lift disabled:opacity-40">
                  {p.inStock ? "Add to cart" : "Out of stock"}
                </button>
              ) : (
                <div className="flex-1 min-w-[160px] flex items-center justify-between rounded-xl bg-primary text-primary-foreground px-3 py-2">
                  <button onClick={() => dec(p.id)} className="grid size-9 place-items-center rounded-lg hover:bg-white/15" aria-label="decrease"><Minus className="size-4" /></button>
                  <span className="font-bold">{quantity} in cart</span>
                  <button onClick={() => inc(p.id)} className="grid size-9 place-items-center rounded-lg hover:bg-white/15" aria-label="increase"><Plus className="size-4" /></button>
                </div>
              )}
              <Link to="/checkout" onClick={() => quantity === 0 && add(p.id)} className="flex-1 min-w-[160px] text-center rounded-xl bg-foreground text-background px-6 py-3.5 text-sm font-bold hover:opacity-90">Buy now</Link>
              <button onClick={() => toggleWish(p.id)} aria-label="wishlist" className="grid size-12 place-items-center rounded-xl border-2 hover:border-primary">
                <Heart className={wished ? "size-5 fill-discount text-discount" : "size-5"} />
              </button>
              <button aria-label="share" onClick={() => toast.info("Link copied")} className="grid size-12 place-items-center rounded-xl border-2 hover:border-primary">
                <Share2 className="size-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border p-3"><Truck className="size-4 text-primary mb-1" />Free above ₹199</div>
              <div className="rounded-xl border p-3"><Clock className="size-4 text-primary mb-1" />Delivery in {p.deliveryMinutes} min</div>
              <div className="rounded-xl border p-3"><ShieldCheck className="size-4 text-primary mb-1" />100% fresh</div>
            </div>

            <div className="mt-8">
              <h2 className="font-display font-black text-lg">About this product</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted-foreground text-xs">Brand</dt><dd className="font-medium">{p.brand}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Weight</dt><dd className="font-medium">{p.weight}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Category</dt><dd className="font-medium">{p.category}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Country of origin</dt><dd className="font-medium">India</dd></div>
              </dl>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <SectionHeader title="Frequently bought together" />
          <div className="rounded-2xl border p-5 flex flex-wrap items-center gap-5">
            {fbt.map((x, i) => (
              <div key={x.id} className="flex items-center gap-3">
                <div className="w-24 h-24 rounded-xl bg-surface grid place-items-center"><img src={x.image} alt={x.name} className="max-h-full max-w-full object-contain" /></div>
                {i < fbt.length - 1 && <span className="text-xl text-muted-foreground">+</span>}
              </div>
            ))}
            <div className="ml-auto">
              <div className="text-xs text-muted-foreground">Bundle total</div>
              <div className="font-black text-xl">₹{fbt.reduce((s, x) => s + x.price, 0)}</div>
              <button onClick={() => { fbt.forEach((x) => add(x.id)); toast.success("Bundle added"); }} className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Add all to cart</button>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <SectionHeader title="Ratings & reviews" subtitle={`${p.reviews} verified ratings`} />
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.slice(0, 4).map((r) => (
              <div key={r.id} className="rounded-2xl border p-5">
                <div className="flex items-center gap-1 text-offer">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-offer" : "opacity-20"}`} />)}
                </div>
                <p className="mt-2 text-sm">{r.text}</p>
                <div className="mt-3 text-xs text-muted-foreground">{r.user} · {r.date}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeader title="Related products" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.map((rp) => <ProductCard key={rp.id} product={rp} />)}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
