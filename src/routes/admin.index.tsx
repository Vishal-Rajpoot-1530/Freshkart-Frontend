import { createFileRoute, Link } from "@tanstack/react-router";
import { IndianRupee, ShoppingBag, Users, Bike, TrendingUp, AlertTriangle, Store, ShieldCheck } from "lucide-react";
import { ConsoleLayout, StatCard, Panel, Pill, Bars } from "@/components/console/ConsoleLayout";
import { SellerRows, RiderList } from "@/components/console/PartnerControls";
import { usePartners } from "@/context/PartnersContext";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — FreshKart operations" },
      { name: "description", content: "Monitor orders, revenue, sellers, riders and inventory health across FreshKart dark stores." },
      { property: "og:title", content: "Admin dashboard — FreshKart operations" },
      { property: "og:description", content: "Live operations view plus full control over seller and rider account verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

const week = [
  { label: "Mon", value: 182 }, { label: "Tue", value: 214 }, { label: "Wed", value: 268 },
  { label: "Thu", value: 241 }, { label: "Fri", value: 322 }, { label: "Sat", value: 396 }, { label: "Sun", value: 348 },
];

const liveOrders = [
  { id: "FK782341", customer: "Aarav Sharma", area: "HSR Layout", items: 8, total: 487, status: "Out for delivery", tone: "primary" as const },
  { id: "FK782339", customer: "Meera Iyer", area: "Koramangala", items: 3, total: 219, status: "Packing", tone: "offer" as const },
  { id: "FK782336", customer: "Rohit Verma", area: "Indiranagar", items: 12, total: 1_140, status: "Picked", tone: "primary" as const },
  { id: "FK782330", customer: "Sana Khan", area: "BTM Layout", items: 5, total: 356, status: "Delayed", tone: "discount" as const },
  { id: "FK782327", customer: "Dev Patel", area: "Jayanagar", items: 2, total: 98, status: "Delivered", tone: "muted" as const },
];

function AdminPage() {
  const lowStock = products.slice(12, 18);
  const { sellers, riders } = usePartners();
  const pending = [...sellers, ...riders].filter((p) => p.status === "pending").length;

  return (
    <ConsoleLayout badge="Admin" title="Operations dashboard" subtitle="Everything happening across your dark stores right now">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue today" value="₹4,86,210" delta="+12.4%" icon={IndianRupee} />
        <StatCard label="Orders today" value="1,284" delta="+8.1%" icon={ShoppingBag} />
        <StatCard label="Active customers" value="38,904" delta="+3.2%" icon={Users} tone="offer" />
        <StatCard label="Riders online" value="86 / 120" icon={Bike} tone="discount" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Orders this week" action={<Pill label="+18% vs last week" tone="primary" />}>
            <Bars data={week} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { k: "Avg delivery", v: "9 min 12 s" },
                { k: "Avg basket", v: "₹412" },
                { k: "Fill rate", v: "97.6%" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl bg-surface p-3">
                  <div className="font-display text-lg font-black">{s.v}</div>
                  <div className="text-[11px] text-muted-foreground">{s.k}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Top categories" action={<TrendingUp className="size-4 text-primary" />}>
          <ul className="space-y-3">
            {categories.slice(0, 6).map((c, i) => {
              const pct = 92 - i * 12;
              return (
                <li key={c.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.emoji} {c.name}</span>
                    <span className="text-muted-foreground text-xs">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <StatCard label="Seller accounts" value={String(sellers.length)} icon={Store} />
        <StatCard label="Rider accounts" value={String(riders.length)} icon={Bike} />
        <StatCard label="Awaiting verification" value={String(pending)} icon={ShieldCheck} tone="offer" />
        <StatCard
          label="Discontinued accounts"
          value={String([...sellers, ...riders].filter((p) => p.status === "suspended").length)}
          icon={AlertTriangle}
          tone="discount"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Sellers" action={<Pill label="verify · discontinue · remove" />}>
            <SellerRows />
            <p className="mt-3 text-xs text-muted-foreground">
              Unverified or discontinued stores cannot receive or accept new orders.
            </p>
          </Panel>
        </div>
        <Panel title="Riders" action={<Pill label="tap for details" tone="primary" />}>
          <RiderList />
          <p className="mt-3 text-xs text-muted-foreground">
            Only verified riders can accept trips from the pickup queue.
          </p>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Live orders" action={<Pill label="auto-refresh" />}>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 font-semibold">Order</th>
                    <th className="py-2 font-semibold">Customer</th>
                    <th className="py-2 font-semibold hidden sm:table-cell">Area</th>
                    <th className="py-2 font-semibold">Total</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveOrders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="py-3 font-mono text-xs font-bold">{o.id}</td>
                      <td className="py-3">
                        <div className="font-medium">{o.customer}</div>
                        <div className="text-xs text-muted-foreground">{o.items} items</div>
                      </td>
                      <td className="py-3 hidden sm:table-cell text-muted-foreground">{o.area}</td>
                      <td className="py-3 font-bold">₹{o.total}</td>
                      <td className="py-3"><Pill label={o.status} tone={o.tone} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <Panel title="Rider fleet on shift">
          <ul className="space-y-3">
            {riders.slice(0, 4).map((r, i) => (
              <li key={r.id}>
                <Link to="/admin/riders/$id" params={{ id: r.id }} className="flex items-center gap-3 rounded-xl border p-3 hover:border-primary transition-colors">
                  <div className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary text-xs font-black">
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.zone} · ★ {r.rating}</div>
                  </div>
                  <Pill
                    label={r.status !== "verified" ? "Blocked" : i % 3 === 1 ? "Idle" : "On trip"}
                    tone={r.status !== "verified" ? "discount" : i % 3 === 1 ? "muted" : "primary"}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel
          title="Low stock alerts"
          action={<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-discount"><AlertTriangle className="size-4" /> 6 SKUs</span>}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="grid size-11 place-items-center rounded-lg bg-surface text-xl">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.weight} · ₹{p.price}</div>
                </div>
                <Pill label={`${3 + i} left`} tone="discount" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  );
}
