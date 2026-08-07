import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, Package, Star, Percent, Plus, PackageX } from "lucide-react";
import { ConsoleLayout, StatCard, Panel, Pill, Bars } from "@/components/console/ConsoleLayout";
import { products } from "@/data/products";

export const Route = createFileRoute("/seller")({
  head: () => ({
    meta: [
      { title: "Seller centre — FreshKart partner store" },
      { name: "description", content: "Manage catalogue, stock, payouts and order fulfilment for your FreshKart partner store." },
      { property: "og:title", content: "Seller centre — FreshKart partner store" },
      { property: "og:description", content: "Catalogue health, incoming orders, payouts and performance for FreshKart sellers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SellerPage,
});

const salesWeek = [
  { label: "Mon", value: 12400 }, { label: "Tue", value: 15200 }, { label: "Wed", value: 17800 },
  { label: "Thu", value: 14100 }, { label: "Fri", value: 21600 }, { label: "Sat", value: 26800 }, { label: "Sun", value: 23100 },
];

const incoming = [
  { id: "FK782352", items: 4, total: 386, sla: "6 min", status: "New", tone: "offer" as const },
  { id: "FK782349", items: 9, total: 912, sla: "3 min", status: "Packing", tone: "primary" as const },
  { id: "FK782345", items: 2, total: 148, sla: "1 min", status: "Ready", tone: "primary" as const },
  { id: "FK782338", items: 6, total: 574, sla: "—", status: "Handed over", tone: "muted" as const },
];

function SellerPage() {
  const catalogue = products.slice(20, 28);
  return (
    <ConsoleLayout badge="Seller" title="Green Basket Mart" subtitle="Partner store · HSR Layout · onboarded Mar 2024">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sales today" value="₹23,140" delta="+9.6%" icon={IndianRupee} />
        <StatCard label="Orders fulfilled" value="184" icon={Package} />
        <StatCard label="Store rating" value="4.7 ★" icon={Star} tone="offer" />
        <StatCard label="Cancellation rate" value="1.2%" icon={Percent} tone="discount" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Sales this week" action={<Pill label="₹1,31,000 total" tone="primary" />}>
            <Bars data={salesWeek} />
          </Panel>
        </div>
        <Panel title="Payout summary">
          <div className="space-y-3 text-sm">
            {[
              { k: "Gross sales (7d)", v: "₹1,31,000" },
              { k: "Platform fee (8%)", v: "− ₹10,480" },
              { k: "Returns & adjustments", v: "− ₹1,240" },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between">
                <span className="text-muted-foreground">{r.k}</span>
                <span className="font-semibold">{r.v}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="font-semibold">Next payout</span>
              <span className="font-display text-xl font-black text-primary">₹1,19,280</span>
            </div>
            <div className="rounded-xl bg-surface p-3 text-xs text-muted-foreground">
              Settles Monday to HDFC ••4821 · UTR shared on completion.
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel
            title="Catalogue"
            action={
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
                <Plus className="size-3.5" /> Add product
              </button>
            }
          >
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 font-semibold">Product</th>
                    <th className="py-2 font-semibold hidden sm:table-cell">Price</th>
                    <th className="py-2 font-semibold">Stock</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {catalogue.map((p, i) => {
                    const stock = (i * 7) % 23;
                    return (
                      <tr key={p.id} className="border-t">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="grid size-9 place-items-center rounded-lg bg-surface text-lg">{p.emoji}</div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.weight}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 hidden sm:table-cell font-semibold">₹{p.price}</td>
                        <td className="py-3">{stock} units</td>
                        <td className="py-3">
                          <Pill
                            label={stock === 0 ? "Out of stock" : stock < 8 ? "Low" : "Live"}
                            tone={stock === 0 ? "discount" : stock < 8 ? "offer" : "primary"}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Incoming orders" action={<Pill label="live" tone="primary" />}>
            <ul className="space-y-3">
              {incoming.map((o) => (
                <li key={o.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold">{o.id}</span>
                    <Pill label={o.status} tone={o.tone} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{o.items} items · ₹{o.total} · SLA {o.sla}</div>
                  <button className="mt-2 w-full rounded-lg border px-3 py-1.5 text-xs font-semibold hover:border-primary transition-colors">
                    Open picklist
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Needs attention" action={<PackageX className="size-4 text-discount" />}>
            <ul className="space-y-2 text-sm">
              {["2 SKUs out of stock", "1 price update pending approval", "3 images below quality guidelines"].map((t) => (
                <li key={t} className="flex items-center gap-2 rounded-xl bg-surface p-3 text-xs font-medium">
                  <span className="size-1.5 rounded-full bg-discount" /> {t}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </ConsoleLayout>
  );
}
