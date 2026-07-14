import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, RotateCcw, FileText } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { products } from "@/data/products";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My orders — FreshKart" }] }),
  component: OrdersPage,
});

const mock = [
  { id: "FK782341", date: "Today, 2:30 PM", status: "Out for delivery", total: 487, items: products.slice(0, 3), active: true },
  { id: "FK781992", date: "Yesterday, 8:12 PM", status: "Delivered", total: 249, items: products.slice(3, 5) },
  { id: "FK780112", date: "12 Nov 2025", status: "Delivered", total: 819, items: products.slice(5, 9) },
  { id: "FK779043", date: "05 Nov 2025", status: "Delivered", total: 349, items: products.slice(9, 11) },
];

function OrdersPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="font-display text-3xl font-black">My orders</h1>
        <p className="text-sm text-muted-foreground">Reorder essentials in one tap</p>

        <div className="mt-6 space-y-4">
          {mock.map((o) => (
            <div key={o.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold">{o.id}</span>
                    <span className={`rounded-md px-2 py-0.5 font-semibold ${o.active ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}>{o.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Total</div>
                  <div className="font-black">₹{o.total}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {o.items.map((p) => (
                  <div key={p.id} className="w-12 h-12 rounded-lg bg-surface grid place-items-center" title={p.name}>
                    <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
                <div className="text-xs text-muted-foreground ml-2">{o.items.length} items</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {o.active && <Link to="/order/$id" params={{ id: o.id }} className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground inline-flex items-center gap-1.5"><Package className="size-3.5" /> Track order</Link>}
                <button className="rounded-lg border px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"><RotateCcw className="size-3.5" /> Reorder</button>
                <button className="rounded-lg border px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"><FileText className="size-3.5" /> Invoice</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
