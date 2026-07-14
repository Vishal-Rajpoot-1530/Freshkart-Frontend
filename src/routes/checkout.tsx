import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, CreditCard, Wallet, Banknote, Check } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — FreshKart" }] }),
  component: CheckoutPage,
});

const addresses = [
  { id: "a1", label: "Home", line: "203, Green Park Apartments, HSR Layout, Bengaluru 560102", phone: "+91 98765 43210" },
  { id: "a2", label: "Work", line: "Level 5, Prestige Tech Park, Marathahalli, Bengaluru 560037", phone: "+91 98765 43210" },
];

const slots = ["10-15 min (Express)", "Within 30 min", "Schedule for later"];

const methods = [
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: Wallet },
  { id: "card", label: "Card", desc: "Credit / Debit", icon: CreditCard },
  { id: "cod", label: "Cash", desc: "Pay on delivery", icon: Banknote },
];

function CheckoutPage() {
  const { state, cartTotal, clear } = useApp();
  const router = useRouter();
  const [addr, setAddr] = useState("a1");
  const [slot, setSlot] = useState(slots[0]);
  const [method, setMethod] = useState("upi");
  const [placing, setPlacing] = useState(false);

  const items = state.cart.map((i) => ({ item: i, product: products.find((p) => p.id === i.productId)! })).filter((x) => x.product);

  const place = () => {
    if (items.length === 0) return toast.error("Your cart is empty");
    setPlacing(true);
    setTimeout(() => {
      const orderId = "FK" + Math.floor(100000 + Math.random() * 900000);
      clear();
      router.navigate({ to: "/order-success", search: { id: orderId } });
    }, 900);
  };

  if (items.length === 0) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-md text-center py-20">
          <h1 className="font-display text-2xl font-black">Your cart is empty</h1>
          <Link to="/" className="mt-4 inline-block text-primary underline">Continue shopping</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="font-display text-3xl font-black">Checkout</h1>

        <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-5">
            <Card title="Delivery address" icon={<MapPin className="size-4 text-primary" />}>
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label key={a.id} className={`flex gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${addr === a.id ? "border-primary bg-primary-soft" : ""}`}>
                    <input type="radio" name="addr" checked={addr === a.id} onChange={() => setAddr(a.id)} className="mt-1 accent-primary" />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{a.label}</div>
                      <div className="text-sm text-muted-foreground">{a.line}</div>
                      <div className="text-xs text-muted-foreground">{a.phone}</div>
                    </div>
                  </label>
                ))}
                <Link to="/addresses" className="text-sm text-primary font-semibold">+ Add new address</Link>
              </div>
            </Card>

            <Card title="Delivery time" icon={<Clock className="size-4 text-primary" />}>
              <div className="grid sm:grid-cols-3 gap-2">
                {slots.map((s) => (
                  <button key={s} onClick={() => setSlot(s)} className={`rounded-xl border-2 px-3 py-3 text-sm text-left ${slot === s ? "border-primary bg-primary-soft" : ""}`}>{s}</button>
                ))}
              </div>
            </Card>

            <Card title="Payment method" icon={<CreditCard className="size-4 text-primary" />}>
              <div className="grid sm:grid-cols-3 gap-2">
                {methods.map((m) => {
                  const I = m.icon;
                  return (
                    <button key={m.id} onClick={() => setMethod(m.id)} className={`rounded-xl border-2 p-4 text-left ${method === m.id ? "border-primary bg-primary-soft" : ""}`}>
                      <I className="size-5 text-primary" />
                      <div className="mt-2 font-semibold text-sm">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h2 className="font-semibold mb-3">Order summary</h2>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-3">
                {items.map(({ item, product }) => (
                  <div key={item.productId} className="flex items-center gap-2 text-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface grid place-items-center shrink-0"><img src={product.image} alt="" className="max-h-full max-w-full object-contain" /></div>
                    <div className="flex-1 min-w-0 truncate">{product.name} × {item.quantity}</div>
                    <div className="font-semibold">₹{product.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1 text-sm">
                <Row label="Subtotal" value={`₹${cartTotal.subtotal}`} />
                <Row label="GST" value={`₹${cartTotal.tax}`} />
                <Row label="Delivery" value={cartTotal.delivery === 0 ? "FREE" : `₹${cartTotal.delivery}`} />
                <div className="border-t mt-2 pt-2 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-xl font-black">₹{cartTotal.total}</span>
                </div>
              </div>
              <button onClick={place} disabled={placing} className="mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lift disabled:opacity-60">
                {placing ? "Placing order..." : `Place order · ₹${cartTotal.total}`}
              </button>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-primary"><Check className="size-3" /> Secure checkout</div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2 font-semibold mb-4">{icon} {title}</div>
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}
