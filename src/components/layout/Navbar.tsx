import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ShoppingCart, Heart, User, Menu, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { categories } from "@/data/categories";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { state, cartCount } = useApp();
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.navigate({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <header className="sticky top-0 z-40 glass border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3 lg:gap-6">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="lg:hidden -ml-1 p-2 rounded-lg hover:bg-muted" aria-label="Open menu">
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <MobileMenu />
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <span className="text-lg font-black">F</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-xl font-black leading-none">FreshKart</div>
              <div className="text-[10px] text-muted-foreground">groceries in minutes</div>
            </div>
          </Link>

          {/* Location */}
          <button className="hidden md:flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-left hover:border-primary/50 transition-colors">
            <MapPin className="size-4 text-primary shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">Delivery in <span className="text-primary font-bold">10 min</span></div>
              <div className="text-sm font-semibold truncate max-w-[180px]">{state.location}</div>
            </div>
            <ChevronDown className="size-4 text-muted-foreground shrink-0" />
          </button>

          {/* Search */}
          <form onSubmit={submit} className="flex-1 min-w-0">
            <label className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 focus-within:border-primary transition-colors">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Search "milk", "bread", "chips"...'
                className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Search products"
              />
              {q && (
                <button type="button" onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground" aria-label="Clear">
                  <X className="size-4" />
                </button>
              )}
            </label>
          </form>

          <div className="flex items-center gap-1">
            <Link to="/wishlist" className="hidden sm:grid size-10 place-items-center rounded-xl hover:bg-muted relative" aria-label="Wishlist">
              <Heart className="size-5" />
              {state.wishlist.length > 0 && (
                <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-discount text-[10px] font-bold text-discount-foreground">
                  {state.wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/profile" className="hidden sm:grid size-10 place-items-center rounded-xl hover:bg-muted" aria-label="Profile">
              <User className="size-5" />
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-xl bg-primary px-3 sm:px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="grid min-w-5 h-5 px-1 place-items-center rounded-full bg-white/25 text-[11px] font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {/* Categories strip - desktop */}
        <nav className="hidden lg:flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
          {categories.slice(0, 12).map((c) => (
            <Link
              key={c.id}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function MobileMenu() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-primary-soft">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <span className="text-lg font-black">F</span>
          </div>
          <div>
            <div className="font-display font-black text-lg">FreshKart</div>
            <div className="text-xs text-muted-foreground">Delivering in minutes</div>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">Shop by category</div>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="flex flex-col items-start gap-1 rounded-xl border p-3 hover:border-primary transition-colors"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-medium leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 border-t grid grid-cols-2 gap-2">
        <Link to="/orders" className="rounded-xl border px-3 py-2 text-sm text-center font-medium">My Orders</Link>
        <Link to="/help" className="rounded-xl border px-3 py-2 text-sm text-center font-medium">Help</Link>
      </div>
    </div>
  );
}
