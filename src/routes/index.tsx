import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Leaf, Truck, Star, ChevronRight, Apple, Smartphone } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/product/ProductGrid";
import { categories } from "@/data/categories";
import { products, offers, reviews } from "@/data/products";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshKart — Groceries delivered in 10 minutes" },
      { name: "description", content: "Farm-fresh produce, snacks, dairy and daily essentials at your door in 10 minutes. Handpicked, fairly priced, delivered fast." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { state } = useApp();
  const bestSelling = products.filter((_, i) => i % 3 === 0).slice(0, 10);
  const flashSale = products.filter((p) => p.discountPercent >= 25).slice(0, 10);
  const todaysDeals = products.filter((p) => p.discountPercent >= 15).slice(0, 10);
  const popular = products.slice(0, 10);
  const recentlyViewed = state.recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => !!p)
    .slice(0, 10);

  return (
    <AppLayout>
      <Hero />

      <Section>
        <SectionHeader title="Shop by category" subtitle="20+ curated categories, one basket" />
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.02 }}
            >
              <Link
                to="/category/$slug" params={{ slug: c.slug }}
                className="group flex flex-col items-center gap-2 rounded-2xl p-2 hover:bg-muted transition-colors"
              >
                <div
                  className="grid size-16 sm:size-20 place-items-center rounded-2xl shadow-soft group-hover:scale-105 transition-transform"
                  style={{ background: c.color }}
                >
                  <span className="text-3xl sm:text-4xl">{c.emoji}</span>
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-center leading-tight line-clamp-2">{c.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <OfferSlider />
      </Section>

      <Section>
        <SectionHeader title="⚡ Flash sale" subtitle="Ends tonight — grab before it's gone" />
        <HScroll>{flashSale.map((p) => <div key={p.id} className="w-44 sm:w-52 shrink-0"><ProductCard product={p} /></div>)}</HScroll>
      </Section>

      <Section>
        <SectionHeader title="Popular right now" subtitle="What your neighbourhood is loving" />
        <HScroll>{popular.map((p) => <div key={p.id} className="w-44 sm:w-52 shrink-0"><ProductCard product={p} /></div>)}</HScroll>
      </Section>

      <Section>
        <SectionHeader title="Best selling" subtitle="Top picks this week" />
        <HScroll>{bestSelling.map((p) => <div key={p.id} className="w-44 sm:w-52 shrink-0"><ProductCard product={p} /></div>)}</HScroll>
      </Section>

      <Section>
        <SectionHeader title="Today's deals" subtitle="Fresh discounts, refreshed daily" />
        <HScroll>{todaysDeals.map((p) => <div key={p.id} className="w-44 sm:w-52 shrink-0"><ProductCard product={p} /></div>)}</HScroll>
      </Section>

      {recentlyViewed.length > 0 && (
        <Section>
          <SectionHeader title="Recently viewed" />
          <HScroll>{recentlyViewed.map((p) => <div key={p.id} className="w-44 sm:w-52 shrink-0"><ProductCard product={p} /></div>)}</HScroll>
        </Section>
      )}

      <WhyChoose />
      <Reviews />
      <AppDownload />
    </AppLayout>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {children}
    </section>
  );
}

function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      {children}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-background to-orange-50" />
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 size-72 rounded-full bg-orange-200/50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold"
          >
            <Zap className="size-3.5 text-primary" /> Delivering in <span className="text-primary">under 10 minutes</span>
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05]"
          >
            Groceries at your door,
            <span className="block text-primary">before the kettle boils.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="mt-4 max-w-lg text-base text-muted-foreground"
          >
            10,000+ handpicked essentials across 20 categories. Farm-fresh produce, top brands, transparent pricing — delivered fast, everyday.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link to="/category/$slug" params={{ slug: "fruits-vegetables" }} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lift hover:opacity-90">
              Start shopping <ChevronRight className="size-4" />
            </Link>
            <Link to="/orders" className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground/10 bg-card px-6 py-3 text-sm font-bold hover:border-primary">
              Track an order
            </Link>
          </motion.div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Free over ₹199</div>
            <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> 100% fresh guarantee</div>
            <div className="hidden sm:flex items-center gap-2"><Leaf className="size-4 text-primary" /> Locally sourced</div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
          className="relative"
        >
          <div className="glass rounded-3xl p-6 shadow-glass">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Your order</div>
                <div className="font-display font-black text-xl">Delivering in 8 mins</div>
              </div>
              <div className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-primary">LIVE</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["🥬","🥛","🍞","🍎","🧀","🍫"].map((e, i) => (
                <motion.div key={i}
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                  className="aspect-square rounded-2xl bg-card grid place-items-center text-4xl shadow-soft"
                >{e}</motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] opacity-80">Total • 6 items</div>
                <div className="font-black text-2xl">₹487</div>
              </div>
              <div className="text-[11px] opacity-80 text-right">
                <div>Delivery fee</div>
                <div className="font-bold text-base">FREE</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function OfferSlider() {
  return (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      {offers.map((o) => (
        <div key={o.id} className={`shrink-0 w-72 sm:w-80 rounded-2xl bg-gradient-to-br ${o.gradient} p-5 text-white shadow-card relative overflow-hidden`}>
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-20">{o.emoji}</div>
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Limited offer</div>
          <div className="mt-2 font-display text-2xl font-black">{o.title}</div>
          <div className="text-sm opacity-90">{o.subtitle}</div>
          <div className="mt-4 inline-block rounded-lg bg-white/25 backdrop-blur px-3 py-1 text-xs font-mono font-bold">CODE: {o.code}</div>
        </div>
      ))}
    </div>
  );
}

function WhyChoose() {
  const items = [
    { icon: Zap, title: "10-minute delivery", desc: "Riders dispatched from your nearest FreshKart hub, always fast." },
    { icon: Leaf, title: "Farm-fresh guaranteed", desc: "Handpicked produce inspected twice before it hits your door." },
    { icon: ShieldCheck, title: "Best prices, always", desc: "Transparent pricing, weekly discounts, and no hidden fees." },
    { icon: Truck, title: "Free over ₹199", desc: "No membership required. Free delivery on eligible orders." },
  ];
  return (
    <Section>
      <SectionHeader title="Why FreshKart" subtitle="Built for the way you actually shop" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => {
          const I = it.icon;
          return (
            <motion.div
              key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border bg-card p-5 shadow-soft"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <I className="size-5" />
              </div>
              <div className="mt-3 font-bold">{it.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{it.desc}</div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

function Reviews() {
  const featured = reviews.slice(0, 6);
  return (
    <Section>
      <SectionHeader title="Loved by 2M+ households" subtitle="Real reviews from real customers" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((r) => (
          <div key={r.id} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-1 text-offer">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`size-4 ${i < r.rating ? "fill-offer" : "opacity-20"}`} />
              ))}
            </div>
            <p className="mt-3 text-sm">"{r.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {r.user.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold">{r.user}</div>
                <div className="text-[11px] text-muted-foreground">{r.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function AppDownload() {
  return (
    <Section>
      <div className="rounded-3xl bg-gradient-to-br from-primary via-emerald-600 to-green-700 p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 text-[280px] opacity-10">📱</div>
        <div className="relative max-w-xl">
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Get the app</div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black">Even faster on mobile</h2>
          <p className="mt-3 opacity-90">One-tap reordering, real-time tracking, and app-only offers. Download FreshKart today.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-black/40 backdrop-blur px-5 py-3 text-sm font-semibold border border-white/20"><Apple className="size-5" /> App Store</a>
            <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-black/40 backdrop-blur px-5 py-3 text-sm font-semibold border border-white/20"><Smartphone className="size-5" /> Google Play</a>
          </div>
        </div>
      </div>
    </Section>
  );
}
