import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { IndianRupee, Package, Star, Percent, Plus, PackageX, Pencil, Trash2, Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { ConsoleLayout, StatCard, Panel, Pill } from "@/components/console/ConsoleLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePartners } from "@/context/PartnersContext";
import { usePartnerAuth } from "@/context/PartnerAuthContext";
import { StatusPill } from "@/components/console/PartnerControls";
import { useCatalogue, type CatalogueDraft, type CatalogueItem } from "@/context/CatalogueContext";
import { sellerOrders, sellerReviews, salesWeek, salesTargetWeek, type SellerOrder } from "@/data/seller";
import { categories } from "@/data/categories";

export const Route = createFileRoute("/seller/")({
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

const catNames = categories.map((c) => c.name);
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const today = sellerOrders[0]?.date ?? new Date().toISOString().slice(0, 10);

const incoming = [
  { id: "FK782352", sla: "6 min", status: "New", tone: "offer" as const },
  { id: "FK782349", sla: "3 min", status: "Packing", tone: "primary" as const },
  { id: "FK782345", sla: "1 min", status: "Ready", tone: "primary" as const },
  { id: "FK782338", sla: "—", status: "Handed over", tone: "muted" as const },
];

type Modal = null | "sales" | "fulfilled" | "reviews" | "cancellations" | { picklist: string };

function SellerPage() {
  const { seller, canAcceptOrders } = usePartners();
  const { session } = usePartnerAuth();
  const id = session?.partnerId ?? "SLR-1001";
  const me = seller(id);
  const active = canAcceptOrders(id);
  const [modal, setModal] = useState<Modal>(null);

  const todayOrders = sellerOrders.filter((o) => o.date === today);
  const salesToday = todayOrders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const fulfilled = sellerOrders.filter((o) => o.status === "Delivered").length;
  const cancelled = sellerOrders.filter((o) => o.status === "Cancelled").length;
  const cancelRate = ((cancelled / sellerOrders.length) * 100).toFixed(1);
  const avgRating = (sellerReviews.reduce((s, r) => s + r.rating, 0) / sellerReviews.length).toFixed(1);
  const weekTotal = salesWeek.reduce((s, d) => s + d.value, 0);
  const progress = Math.min(100, Math.round((weekTotal / salesTargetWeek) * 100));

  return (
    <ConsoleLayout
      badge="Seller"
      title={me?.store ?? session?.name ?? "Partner store"}
      subtitle={active ? `Partner store · ${me?.area ?? "HSR Layout"} · onboarded ${me?.onboarded ?? "Mar 2024"}` : "Partner store · order acceptance blocked"}
    >
      {!active && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-discount/40 bg-discount/10 p-4">
          {me && <StatusPill status={me.status} />}
          <p className="text-sm font-semibold text-discount">
            Your store isn't verified, so new orders can't be accepted. Upload pending documents for admin review.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sales today" value={inr(salesToday)} delta="+9.6%" icon={IndianRupee} onClick={() => setModal("sales")} hint="See today's orders" />
        <StatCard label="Orders fulfilled" value={String(fulfilled)} icon={Package} onClick={() => setModal("fulfilled")} hint="See fulfilled orders" />
        <StatCard label="Store rating" value={`${avgRating} ★`} icon={Star} tone="offer" onClick={() => setModal("reviews")} hint={`Read ${sellerReviews.length} reviews`} />
        <StatCard label="Cancellation rate" value={`${cancelRate}%`} icon={Percent} tone="discount" onClick={() => setModal("cancellations")} hint="See cancellations" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Sales this week" action={<Pill label={`${inr(weekTotal)} total`} tone="primary" />}>
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Weekly target {inr(salesTargetWeek)}</span>
                <span className="text-primary">{progress}% achieved</span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salesWeek} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v: number) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }}
                    formatter={(v, _n, item) => {
                      const key = (item as { dataKey?: string })?.dataKey;
                      const num = Number(v);
                      if (key === "orders") return [`${num} orders`, "Orders"];
                      if (key === "target") return [inr(num), "Daily target"];
                      return [inr(num), "Sales"];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="value" name="Sales" radius={[6, 6, 0, 0]} fill="var(--color-primary)" maxBarSize={38} />
                  <Line type="monotone" dataKey="target" name="Daily target" stroke="var(--color-discount)" strokeWidth={2} dot={false} strokeDasharray="5 4" />
                  <Line type="monotone" dataKey="orders" name="Orders" stroke="var(--color-offer-foreground)" strokeWidth={2} dot={{ r: 3 }} yAxisId={0} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
        <Panel title="Payout summary">
          <div className="space-y-3 text-sm">
            {[
              { k: "Gross sales (7d)", v: inr(weekTotal) },
              { k: "Platform fee (8%)", v: `− ${inr(Math.round(weekTotal * 0.08))}` },
              { k: "Returns & adjustments", v: "− ₹1,240" },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between">
                <span className="text-muted-foreground">{r.k}</span>
                <span className="font-semibold">{r.v}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="font-semibold">Next payout</span>
              <span className="font-display text-xl font-black text-primary">{inr(Math.round(weekTotal * 0.92) - 1240)}</span>
            </div>
            <div className="rounded-xl bg-surface p-3 text-xs text-muted-foreground">
              Settles Monday to HDFC ••4821 · UTR shared on completion.
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CataloguePanel />
        </div>

        <div className="space-y-4">
          <Panel title="Incoming orders" action={<Pill label="live" tone="primary" />}>
            <ul className="space-y-3">
              {incoming.map((o) => {
                const order = sellerOrders.find((x) => x.id === o.id) ?? sellerOrders[0];
                return (
                  <li key={o.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold">{o.id}</span>
                      <Pill label={o.status} tone={o.tone} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {order.items.length} items · {inr(order.total)} · SLA {o.sla}
                    </div>
                    <button
                      disabled={!active}
                      onClick={() => setModal({ picklist: o.id })}
                      title={active ? undefined : "Store must be verified to accept orders"}
                      className="mt-2 w-full rounded-lg border px-3 py-1.5 text-xs font-semibold hover:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border"
                    >
                      {active ? "Open picklist" : "Locked"}
                    </button>
                  </li>
                );
              })}
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

      <OrdersDialog
        open={modal === "sales"}
        onClose={() => setModal(null)}
        title="Sales today"
        description={`${todayOrders.length} orders placed today · ${inr(salesToday)} net sales`}
        orders={todayOrders}
      />
      <OrdersDialog
        open={modal === "fulfilled"}
        onClose={() => setModal(null)}
        title="Orders fulfilled"
        description={`${fulfilled} delivered orders across the last 8 days`}
        orders={sellerOrders.filter((o) => o.status === "Delivered")}
      />
      <OrdersDialog
        open={modal === "cancellations"}
        onClose={() => setModal(null)}
        title="Cancellations"
        description={`${cancelled} cancelled orders · ${cancelRate}% of total volume`}
        orders={sellerOrders.filter((o) => o.status === "Cancelled")}
      />
      <ReviewsDialog open={modal === "reviews"} onClose={() => setModal(null)} />
      <PicklistDialog
        order={typeof modal === "object" && modal !== null && "picklist" in modal ? sellerOrders.find((o) => o.id === modal.picklist) ?? null : null}
        onClose={() => setModal(null)}
      />
    </ConsoleLayout>
  );
}

/* ---------------- Catalogue ---------------- */

const emptyDraft: CatalogueDraft = { name: "", category: catNames[0], brand: "FreshKart", weight: "500 g", price: 0, mrp: 0, stock: 0, emoji: "🛒" };

function CataloguePanel() {
  const { items, addItem, updateItem, removeItem } = useCatalogue();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [stock, setStock] = useState("all");
  const [sort, setSort] = useState("newest");
  const [editing, setEditing] = useState<CatalogueItem | "new" | null>(null);
  const [confirm, setConfirm] = useState<CatalogueItem | null>(null);

  const filtered = useMemo(() => {
    let list = items.filter((it) => {
      const text = `${it.name} ${it.brand} ${it.id} ${it.category}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (cat !== "all" && it.category !== cat) return false;
      if (stock === "out" && it.stock !== 0) return false;
      if (stock === "low" && !(it.stock > 0 && it.stock < 8)) return false;
      if (stock === "live" && it.stock < 8) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "newest" ? b.addedAt.localeCompare(a.addedAt)
      : sort === "price-asc" ? a.price - b.price
      : sort === "price-desc" ? b.price - a.price
      : sort === "stock" ? a.stock - b.stock
      : a.name.localeCompare(b.name),
    );
    return list;
  }, [items, q, cat, stock, sort]);

  const cats = Array.from(new Set(items.map((i) => i.category)));

  return (
    <Panel
      title="Catalogue"
      action={
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
          <Plus className="size-3.5" /> Add product
        </button>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <label className="flex flex-1 min-w-[180px] items-center gap-2 rounded-xl border bg-background px-3 py-2 focus-within:border-primary">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product, brand, SKU…" className="w-full bg-transparent text-sm outline-none" />
          {q && <button onClick={() => setQ("")} aria-label="Clear search"><X className="size-3.5 text-muted-foreground" /></button>}
        </label>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm">
          <option value="all">All categories</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={stock} onChange={(e) => setStock(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm">
          <option value="all">Any stock</option>
          <option value="live">Live (8+)</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm">
          <option value="newest">Newest added</option>
          <option value="name">Name A–Z</option>
          <option value="price-asc">Price low → high</option>
          <option value="price-desc">Price high → low</option>
          <option value="stock">Stock low → high</option>
        </select>
      </div>

      <div className="text-xs text-muted-foreground mb-2">{filtered.length} of {items.length} SKUs</div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 font-semibold">Product</th>
              <th className="py-2 font-semibold hidden sm:table-cell">Price</th>
              <th className="py-2 font-semibold">Stock</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-surface text-lg">{p.emoji}</div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.weight} · {p.category} · {p.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 hidden sm:table-cell font-semibold">{inr(p.price)}</td>
                <td className="py-3">{p.stock} units</td>
                <td className="py-3">
                  <Pill
                    label={p.stock === 0 ? "Out of stock" : p.stock < 8 ? "Low" : "Live"}
                    tone={p.stock === 0 ? "discount" : p.stock < 8 ? "offer" : "primary"}
                  />
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(p)} aria-label={`Update ${p.name}`} className="grid size-8 place-items-center rounded-lg border hover:border-primary">
                      <Pencil className="size-3.5" />
                    </button>
                    <button onClick={() => setConfirm(p)} aria-label={`Remove ${p.name}`} className="grid size-8 place-items-center rounded-lg border text-discount hover:border-discount">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No products match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductDialog
        item={editing}
        onClose={() => setEditing(null)}
        onSave={(draft) => {
          if (editing === "new") {
            addItem(draft);
            toast.success(`${draft.name} added to your catalogue`);
          } else if (editing) {
            updateItem(editing.id, draft);
            toast.success(`${draft.name} updated`);
          }
          setEditing(null);
        }}
      />

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove product?</DialogTitle>
            <DialogDescription>{confirm?.name} will be removed from your catalogue and delisted from the storefront.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <button onClick={() => setConfirm(null)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Cancel</button>
            <button
              onClick={() => {
                if (confirm) {
                  removeItem(confirm.id);
                  toast.success(`${confirm.name} removed`);
                }
                setConfirm(null);
              }}
              className="rounded-xl bg-discount px-4 py-2 text-sm font-bold text-white"
            >
              Remove
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

function ProductDialog({ item, onClose, onSave }: { item: CatalogueItem | "new" | null; onClose: () => void; onSave: (d: CatalogueDraft) => void }) {
  const open = item !== null;
  const initial: CatalogueDraft = item && item !== "new"
    ? { name: item.name, category: item.category, brand: item.brand, weight: item.weight, price: item.price, mrp: item.mrp, stock: item.stock, emoji: item.emoji }
    : emptyDraft;
  const [draft, setDraft] = useState<CatalogueDraft>(initial);
  const [key, setKey] = useState("");
  const currentKey = item === "new" ? "new" : item?.id ?? "";
  if (open && key !== currentKey) {
    setKey(currentKey);
    setDraft(initial);
  }

  const set = <K extends keyof CatalogueDraft>(k: K, v: CatalogueDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item === "new" ? "Add product" : "Update product"}</DialogTitle>
          <DialogDescription>Products go live on the storefront as soon as stock is above zero.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim()) return toast.error("Product name is required");
            if (draft.price <= 0) return toast.error("Enter a selling price");
            onSave({ ...draft, mrp: draft.mrp || draft.price });
          }}
          className="space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Product name"><input value={draft.name} onChange={(e) => set("name", e.target.value)} className="fk-in" placeholder="Organic Bananas" /></Field>
            <Field label="Brand"><input value={draft.brand} onChange={(e) => set("brand", e.target.value)} className="fk-in" /></Field>
            <Field label="Category">
              <select value={draft.category} onChange={(e) => set("category", e.target.value)} className="fk-in">
                {catNames.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Pack size"><input value={draft.weight} onChange={(e) => set("weight", e.target.value)} className="fk-in" placeholder="500 g" /></Field>
            <Field label="Selling price (₹)"><input type="number" min={0} value={draft.price} onChange={(e) => set("price", Number(e.target.value))} className="fk-in" /></Field>
            <Field label="MRP (₹)"><input type="number" min={0} value={draft.mrp} onChange={(e) => set("mrp", Number(e.target.value))} className="fk-in" /></Field>
            <Field label="Stock (units)"><input type="number" min={0} value={draft.stock} onChange={(e) => set("stock", Number(e.target.value))} className="fk-in" /></Field>
            <Field label="Emoji / icon"><input value={draft.emoji} onChange={(e) => set("emoji", e.target.value)} className="fk-in" maxLength={4} /></Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-sm font-semibold">Cancel</button>
            <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              {item === "new" ? "Add product" : "Save changes"}
            </button>
          </div>
        </form>
        <style>{`.fk-in{width:100%;border:1px solid var(--color-border);background:var(--color-background);border-radius:12px;padding:9px 12px;font-size:14px;outline:none}.fk-in:focus{border-color:var(--color-primary)}`}</style>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold">{label}</div>
      {children}
    </label>
  );
}

/* ---------------- Orders / reviews / picklist ---------------- */

function OrdersDialog({ open, onClose, title, description, orders }: { open: boolean; onClose: () => void; title: string; description: string; orders: SellerOrder[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = orders.filter((o) => {
    const text = `${o.id} ${o.customer} ${o.items.map((i) => i.name).join(" ")}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (cat !== "all" && !o.items.some((i) => i.category === cat)) return false;
    if (status !== "all" && o.status !== status) return false;
    if (from && o.date < from) return false;
    if (to && o.date > to) return false;
    return true;
  });
  const total = filtered.reduce((s, o) => s + o.total, 0);
  const cats = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.category))));
  const statuses = Array.from(new Set(orders.map((o) => o.status)));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <label className="flex flex-1 min-w-[160px] items-center gap-2 rounded-xl border bg-background px-3 py-2 focus-within:border-primary">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order ID, customer, product…" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm">
            <option value="all">All categories</option>
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm">
            <option value="all">Any status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" className="rounded-xl border bg-background px-3 py-2 text-sm" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" className="rounded-xl border bg-background px-3 py-2 text-sm" />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} orders</span>
          <span className="font-semibold text-foreground">{inr(total)} value</span>
        </div>

        <ul className="space-y-2">
          {filtered.map((o) => (
            <li key={o.id} className="rounded-xl border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold">{o.id}</span>
                <div className="flex items-center gap-2">
                  <Pill label={o.status} tone={o.status === "Cancelled" ? "discount" : o.status === "Delivered" ? "primary" : "offer"} />
                  <span className="text-sm font-bold">{inr(o.total)}</span>
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {o.date} · {o.slot} · {o.customer}{o.reason ? ` · ${o.reason}` : ""}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {o.items.map((i) => (
                  <span key={i.name} className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium">{i.emoji} {i.name} ×{i.qty}</span>
                ))}
              </div>
            </li>
          ))}
          {filtered.length === 0 && <li className="py-8 text-center text-sm text-muted-foreground">No orders match these filters.</li>}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function ReviewsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [rating, setRating] = useState("all");
  const [cat, setCat] = useState("all");
  const [from, setFrom] = useState("");

  const filtered = sellerReviews.filter((r) => {
    if (q && !`${r.customer} ${r.product} ${r.comment}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (rating !== "all" && r.rating !== Number(rating)) return false;
    if (cat !== "all" && r.category !== cat) return false;
    if (from && r.date < from) return false;
    return true;
  });
  const cats = Array.from(new Set(sellerReviews.map((r) => r.category)));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer reviews</DialogTitle>
          <DialogDescription>{sellerReviews.length} reviews across your catalogue</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <label className="flex flex-1 min-w-[160px] items-center gap-2 rounded-xl border bg-background px-3 py-2 focus-within:border-primary">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reviews, products…" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm">
            <option value="all">All ratings</option>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star</option>)}
          </select>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm">
            <option value="all">All categories</option>
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" className="rounded-xl border bg-background px-3 py-2 text-sm" />
        </div>

        <ul className="space-y-2">
          {filtered.map((r) => (
            <li key={r.id} className="rounded-xl border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{r.customer}</span>
                <span className="text-xs font-bold text-offer-foreground">{"★".repeat(r.rating)}<span className="text-muted-foreground">{"★".repeat(5 - r.rating)}</span></span>
              </div>
              <div className="text-xs text-muted-foreground">{r.product} · {r.category} · {r.date}</div>
              <p className="mt-1.5 text-sm">{r.comment}</p>
            </li>
          ))}
          {filtered.length === 0 && <li className="py-8 text-center text-sm text-muted-foreground">No reviews match these filters.</li>}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function PicklistDialog({ order, onClose }: { order: SellerOrder | null; onClose: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [id, setId] = useState("");
  if (order && id !== order.id) {
    setId(order.id);
    setPicked([]);
  }
  const total = order?.items.reduce((s, i) => s + i.qty, 0) ?? 0;
  const done = picked.length;
  const pct = total ? Math.round((done / order!.items.length) * 100) : 0;

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Picklist · {order?.id}</DialogTitle>
          <DialogDescription>{order?.items.length} lines · {total} units · {order ? inr(order.total) : ""}</DialogDescription>
        </DialogHeader>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <ul className="space-y-2">
          {order?.items.map((i) => {
            const on = picked.includes(i.name);
            return (
              <li key={i.name}>
                <button
                  onClick={() => setPicked((p) => (on ? p.filter((x) => x !== i.name) : [...p, i.name]))}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${on ? "border-primary bg-primary-soft/40" : "hover:border-primary"}`}
                >
                  <div className="grid size-9 place-items-center rounded-lg bg-surface text-lg">{i.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.category} · {inr(i.price)}</div>
                  </div>
                  <Pill label={`×${i.qty}`} tone={on ? "primary" : "muted"} />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm font-semibold">Close</button>
          <button
            disabled={pct < 100}
            onClick={() => {
              toast.success(`${order?.id} packed and ready for rider handover`);
              onClose();
            }}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {pct < 100 ? `Pick all items (${done}/${order?.items.length})` : "Mark packed"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
