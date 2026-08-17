import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  IndianRupee, ShoppingBag, Users, Bike, TrendingUp, AlertTriangle, Store, ShieldCheck, X, Search,
} from "lucide-react";
import {
  BarChart, Bar as RBar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ConsoleLayout, StatCard, Panel, Pill } from "@/components/console/ConsoleLayout";
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

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const week = [
  { label: "Mon", orders: 182, revenue: 621_400, aov: 341 },
  { label: "Tue", orders: 214, revenue: 704_800, aov: 329 },
  { label: "Wed", orders: 268, revenue: 918_600, aov: 343 },
  { label: "Thu", orders: 241, revenue: 812_300, aov: 337 },
  { label: "Fri", orders: 322, revenue: 1_186_500, aov: 368 },
  { label: "Sat", orders: 396, revenue: 1_512_900, aov: 382 },
  { label: "Sun", orders: 348, revenue: 1_338_200, aov: 384 },
];

const revenueByStore = [
  { store: "HSR Store 02", orders: 412, revenue: 168_400, growth: "+14%" },
  { store: "Koramangala Store", orders: 358, revenue: 141_900, growth: "+9%" },
  { store: "Indiranagar Store", orders: 246, revenue: 96_800, growth: "+6%" },
  { store: "Jayanagar Store", orders: 168, revenue: 52_310, growth: "-2%" },
  { store: "BTM Store 01", orders: 100, revenue: 26_800, growth: "+21%" },
];

const orderStatuses = ["Out for delivery", "Packing", "Picked", "Delayed", "Delivered"] as const;

const liveOrders = Array.from({ length: 18 }, (_, i) => {
  const areas = ["HSR Layout", "Koramangala", "Indiranagar", "BTM Layout", "Jayanagar"];
  const names = ["Aarav Sharma", "Meera Iyer", "Rohit Verma", "Sana Khan", "Dev Patel", "Nikita Bose", "Arjun Rao"];
  return {
    id: `FK7823${(20 + i).toString().padStart(2, "0")}`,
    customer: names[i % names.length],
    area: areas[i % areas.length],
    items: 2 + ((i * 3) % 11),
    total: 98 + ((i * 137) % 1_240),
    status: orderStatuses[i % orderStatuses.length],
    rider: ["Imran Sheikh", "Kavya Reddy", "Nisha Thomas", "Prakash Murthy"][i % 4],
    placed: `${9 + Math.floor(i / 2)}:${i % 2 ? "40" : "05"} ${9 + Math.floor(i / 2) >= 12 ? "PM" : "AM"}`,
  };
});

const statusTone = (s: string) =>
  s === "Delayed" ? ("discount" as const) : s === "Packing" ? ("offer" as const) : s === "Delivered" ? ("muted" as const) : ("primary" as const);

const customerSegments = [
  { segment: "New this week", count: 1_284, share: 3, note: "First order placed in last 7 days" },
  { segment: "Active (30 days)", count: 38_904, share: 100, note: "Ordered at least once this month" },
  { segment: "Repeat buyers", count: 21_460, share: 55, note: "3+ orders in last 30 days" },
  { segment: "FreshKart Plus", count: 6_120, share: 16, note: "Subscription members" },
  { segment: "Churn risk", count: 2_310, share: 6, note: "No order in 21+ days" },
];

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full sm:max-w-2xl max-h-[88dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border bg-card p-5 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-black">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-xl hover:bg-muted" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function Rows({ head, rows }: { head: string[]; rows: (string | number | ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            {head.map((h) => <th key={h} className="py-2 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              {r.map((c, j) => <td key={j} className="py-2.5 align-middle">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type AdminModal = "revenue" | "orders" | "customers" | "riders" | "day" | "category" | null;

function AdminPage() {
  const { sellers, riders } = usePartners();
  const [modal, setModal] = useState<AdminModal>(null);
  const [day, setDay] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [area, setArea] = useState("all");
  const [restocked, setRestocked] = useState<string[]>([]);

  const pending = [...sellers, ...riders].filter((p) => p.status === "pending").length;
  const lowStock = products.slice(12, 18);
  const areas = useMemo(() => Array.from(new Set(liveOrders.map((o) => o.area))), []);

  const filteredOrders = useMemo(
    () =>
      liveOrders.filter((o) => {
        const s = q.trim().toLowerCase();
        const match = !s || o.id.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s) || o.rider.toLowerCase().includes(s);
        return match && (status === "all" || o.status === status) && (area === "all" || o.area === area);
      }),
    [q, status, area],
  );

  const revenueToday = 486_210;
  const ordersToday = 1_284;
  const dayData = week.find((w) => w.label === day);
  const catData = categories.find((c) => c.name === cat);
  const catProducts = useMemo(() => (catData ? products.filter((p) => p.categorySlug === catData.slug).slice(0, 8) : []), [catData]);

  const onlineRiders = riders.map((r, i) => ({
    ...r,
    state: r.status !== "verified" ? "Blocked" : i % 3 === 1 ? "Idle" : "On trip",
    trips: 3 + ((i * 5) % 9),
  }));

  return (
    <ConsoleLayout badge="Admin" title="Operations dashboard" subtitle="Everything happening across your dark stores right now">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue today" value={inr(revenueToday)} delta="+12.4%" icon={IndianRupee} onClick={() => setModal("revenue")} hint="Store-wise split" />
        <StatCard label="Orders today" value={ordersToday.toLocaleString("en-IN")} delta="+8.1%" icon={ShoppingBag} onClick={() => setModal("orders")} hint="See live orders" />
        <StatCard label="Active customers" value="38,904" delta="+3.2%" icon={Users} tone="offer" onClick={() => setModal("customers")} hint="See segments" />
        <StatCard label="Riders online" value={`${onlineRiders.filter((r) => r.state !== "Blocked").length} / ${riders.length}`} icon={Bike} tone="discount" onClick={() => setModal("riders")} hint="See fleet status" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Orders this week" action={<Pill label="click a bar for details" tone="primary" />}>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={week} onClick={(e) => {
                  const label = (e?.activeLabel as string) ?? null;
                  if (label) { setDay(label); setModal("day"); }
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={34} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }}
                    formatter={(v, _n, item) => {
                      const key = (item as { dataKey?: string })?.dataKey;
                      const num = Number(v);
                      if (key === "revenue") return [inr(num), "Revenue"];
                      if (key === "aov") return [inr(num), "Avg basket"];
                      return [`${num} orders`, "Orders"];
                    }}
                  />
                  <RBar dataKey="orders" radius={[8, 8, 0, 0]} maxBarSize={38} cursor="pointer">
                    {week.map((d) => (
                      <Cell key={d.label} fill={d.label === day ? "var(--color-offer)" : "var(--color-primary)"} />
                    ))}
                  </RBar>
                  <Line type="monotone" dataKey="aov" stroke="var(--color-discount)" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
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
                  <button
                    className="w-full text-left rounded-lg p-1 -m-1 hover:bg-surface transition-colors"
                    onClick={() => { setCat(c.name); setModal("category"); }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.emoji} {c.name}</span>
                      <span className="text-muted-foreground text-xs">{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
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
          <Panel title="Live orders" action={<Pill label={`${filteredOrders.length} shown`} tone="primary" />}>
            <div className="flex flex-wrap gap-2">
              <label className="flex flex-1 min-w-40 items-center gap-2 rounded-xl border bg-surface px-3 py-2 focus-within:border-primary">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search order, customer, rider"
                  aria-label="Search live orders"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="rounded-xl border bg-surface px-3 py-2 text-sm">
                <option value="all">All statuses</option>
                {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Filter by area" className="rounded-xl border bg-surface px-3 py-2 text-sm">
                <option value="all">All areas</option>
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="mt-3 overflow-x-auto no-scrollbar">
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
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="py-3 font-mono text-xs font-bold">{o.id}</td>
                      <td className="py-3">
                        <div className="font-medium">{o.customer}</div>
                        <div className="text-xs text-muted-foreground">{o.items} items · {o.placed}</div>
                      </td>
                      <td className="py-3 hidden sm:table-cell text-muted-foreground">{o.area}</td>
                      <td className="py-3 font-bold">{inr(o.total)}</td>
                      <td className="py-3"><Pill label={o.status} tone={statusTone(o.status)} /></td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No orders match these filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <Panel title="Rider fleet on shift">
          <ul className="space-y-3">
            {onlineRiders.slice(0, 4).map((r) => (
              <li key={r.id}>
                <Link to="/admin/riders/$id" params={{ id: r.id }} className="flex items-center gap-3 rounded-xl border p-3 hover:border-primary transition-colors">
                  <div className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary text-xs font-black">
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.zone} · ★ {r.rating}</div>
                  </div>
                  <Pill label={r.state} tone={r.state === "Blocked" ? "discount" : r.state === "Idle" ? "muted" : "primary"} />
                </Link>
              </li>
            ))}
          </ul>
          <button onClick={() => setModal("riders")} className="mt-3 w-full rounded-xl border py-2 text-xs font-bold hover:border-primary">
            View full fleet
          </button>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel
          title="Low stock alerts"
          action={<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-discount"><AlertTriangle className="size-4" /> {lowStock.length - restocked.length} SKUs</span>}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((p, i) => {
              const done = restocked.includes(p.id);
              return (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="grid size-11 place-items-center rounded-lg bg-surface text-xl">{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.weight} · ₹{p.price}</div>
                  </div>
                  {done ? (
                    <Pill label="Restock raised" tone="primary" />
                  ) : (
                    <button
                      onClick={() => { setRestocked((r) => [...r, p.id]); toast.success(`Restock request raised for ${p.name}`); }}
                      className="rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground"
                    >
                      Restock ({3 + i} left)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {modal === "revenue" && (
        <Modal title="Revenue today" subtitle={`${inr(revenueToday)} across ${revenueByStore.length} dark stores`} onClose={() => setModal(null)}>
          <Rows
            head={["Store", "Orders", "Revenue", "vs last week"]}
            rows={revenueByStore.map((s) => [
              <span className="font-semibold">{s.store}</span>,
              s.orders,
              <span className="font-bold">{inr(s.revenue)}</span>,
              <Pill label={s.growth} tone={s.growth.startsWith("-") ? "discount" : "primary"} />,
            ])}
          />
        </Modal>
      )}

      {modal === "orders" && (
        <Modal title="Orders today" subtitle={`${ordersToday.toLocaleString("en-IN")} orders · ${liveOrders.length} live right now`} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {orderStatuses.map((s) => (
              <div key={s} className="rounded-xl bg-surface p-3">
                <div className="font-display text-lg font-black">{liveOrders.filter((o) => o.status === s).length}</div>
                <div className="text-[11px] text-muted-foreground">{s}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Rows
              head={["Order", "Customer", "Rider", "Total", "Status"]}
              rows={liveOrders.map((o) => [
                <span className="font-mono text-xs font-bold">{o.id}</span>,
                o.customer,
                o.rider,
                <span className="font-bold">{inr(o.total)}</span>,
                <Pill label={o.status} tone={statusTone(o.status)} />,
              ])}
            />
          </div>
        </Modal>
      )}

      {modal === "customers" && (
        <Modal title="Active customers" subtitle="38,904 customers ordered in the last 30 days" onClose={() => setModal(null)}>
          <ul className="space-y-3">
            {customerSegments.map((s) => (
              <li key={s.segment} className="rounded-xl border p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{s.segment}</span>
                  <span className="font-bold">{s.count.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${s.share}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {modal === "riders" && (
        <Modal title="Rider fleet" subtitle="Live shift status across all zones" onClose={() => setModal(null)}>
          <Rows
            head={["Rider", "Zone", "Trips today", "Rating", "Status"]}
            rows={onlineRiders.map((r) => [
              <Link to="/admin/riders/$id" params={{ id: r.id }} className="font-semibold hover:text-primary">{r.name}</Link>,
              r.zone,
              r.state === "Blocked" ? "—" : r.trips,
              `★ ${r.rating}`,
              <Pill label={r.state} tone={r.state === "Blocked" ? "discount" : r.state === "Idle" ? "muted" : "primary"} />,
            ])}
          />
        </Modal>
      )}

      {modal === "day" && dayData && (
        <Modal title={`${dayData.label} performance`} subtitle={`${dayData.orders} orders · ${inr(dayData.revenue)} revenue`} onClose={() => { setModal(null); setDay(null); }}>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { k: "Orders", v: String(dayData.orders) },
              { k: "Revenue", v: inr(dayData.revenue) },
              { k: "Avg basket", v: inr(dayData.aov) },
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-surface p-3">
                <div className="font-display text-base font-black">{s.v}</div>
                <div className="text-[11px] text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByStore}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="store" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
                <Tooltip formatter={(v) => [inr(Number(v)), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
                <RBar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Modal>
      )}

      {modal === "category" && catData && (
        <Modal title={`${catData.emoji} ${catData.name}`} subtitle={`${catData.itemCount} SKUs listed · top sellers this week`} onClose={() => { setModal(null); setCat(null); }}>
          <Rows
            head={["Product", "Pack", "Price", "Rating"]}
            rows={catProducts.map((p) => [
              <Link to="/product/$id" params={{ id: p.id }} className="font-semibold hover:text-primary">{p.emoji} {p.name}</Link>,
              p.weight,
              <span className="font-bold">₹{p.price}</span>,
              `★ ${p.rating}`,
            ])}
          />
          <Link
            to="/category/$slug"
            params={{ slug: catData.slug }}
            className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Open category on storefront
          </Link>
        </Modal>
      )}
    </ConsoleLayout>
  );
}
