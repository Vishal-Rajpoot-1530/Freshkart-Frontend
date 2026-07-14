import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, Tag, ShoppingBag } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — FreshKart" }] }),
  component: CartPage,
});

function CartPage() {
  const { state, inc, dec, remove, cartTotal } = useApp();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; amount: number } | null>(null);

  const items = state.cart.map((i) => ({ item: i, product: products.find((p) => p.id === i.productId)! })).filter((x) => x.product);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (["FRESH40", "WEEKEND60", "FRUIT3"].includes(code)) {
      setApplied({ code, amount: Math.min(Math.round(cartTotal.subtotal * 0.1), 100) });
      toast.success(`Coupon ${code} applied`);
    } else toast.error("Invalid coupon");
  };

  const discount = applied?.amount ?? 0;
  const finalTotal = Math.max(0, cartTotal.total - discount);

  if (items.length === 0) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-full bg-primary-soft"><ShoppingBag className="size-10 text-primary" /></div>
          <h1 className="mt-6 font-display text-2xl font-black">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add fresh essentials to get started.</p>
          <Link to="/" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Start shopping</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="font-display text-3xl font-black">Your cart</h1>
        <p className="text-sm text-muted-foreground">{state.cart.reduce((n, i) => n + i.quantity, 0)} items</p>

        <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-3">
            {items.map(({ item, product }) => (
              <div key={item.productId} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-soft">
                <div className="w-20 h-20 rounded-xl bg-surface grid place-items-center shrink-0">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm line-clamp-2">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.weight} · {product.brand}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="font-bold">₹{product.price}</div>
                    {product.originalPrice > product.price && <div className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</div>}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => remove(item.productId)} className="text-muted-foreground hover:text-discount" aria-label="Remove"><Trash2 className="size-4" /></button>
                  <div className="flex items-center rounded-lg bg-primary text-primary-foreground">
                    <button onClick={() => dec(item.productId)} className="grid size-8 place-items-center" aria-label="decrease"><Minus className="size-3.5" /></button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => inc(item.productId)} className="grid size-8 place-items-center" aria-label="increase"><Plus className="size-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3"><Tag className="size-4 text-primary" /> Apply coupon</div>
              <div className="flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="FRESH40" className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                <button onClick={applyCoupon} className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-semibold">Apply</button>
              </div>
              {applied && <div className="mt-2 text-xs text-primary font-semibold">✓ {applied.code} — ₹{applied.amount} off</div>}
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h2 className="font-semibold mb-3">Order summary</h2>
              <Row label="Subtotal" value={`₹${cartTotal.subtotal}`} />
              <Row label="You save" value={`− ₹${cartTotal.savings}`} className="text-primary" />
              {discount > 0 && <Row label={`Coupon (${applied?.code})`} value={`− ₹${discount}`} className="text-primary" />}
              <Row label="GST (5%)" value={`₹${cartTotal.tax}`} />
              <Row label="Delivery" value={cartTotal.delivery === 0 ? "FREE" : `₹${cartTotal.delivery}`} className={cartTotal.delivery === 0 ? "text-primary font-semibold" : ""} />
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <div className="font-semibold">Total</div>
                <div className="font-display text-xl font-black">₹{finalTotal}</div>
              </div>
              <Link to="/checkout" className="mt-4 block text-center rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lift hover:opacity-90">Proceed to checkout</Link>
              {cartTotal.subtotal < 199 && (
                <div className="mt-3 text-xs text-center text-muted-foreground">Add ₹{199 - cartTotal.subtotal} more for FREE delivery</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

function Row({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-center justify-between py-1 text-sm ${className}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
