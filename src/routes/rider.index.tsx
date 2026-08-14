import { createFileRoute } from "@tanstack/react-router";
import { Bike, IndianRupee, Timer, Navigation, MapPin, Phone, CheckCircle2, Star, X } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState, type ReactNode } from "react";
import { BarChart, Bar as RBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ConsoleLayout, StatCard, Panel, Pill } from "@/components/console/ConsoleLayout";
import { products } from "@/data/products";
import { usePartners } from "@/context/PartnersContext";
import { usePartnerAuth } from "@/context/PartnerAuthContext";
import { StatusPill } from "@/components/console/PartnerControls";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const deliveriesToday = Array.from({ length: 14 }, (_, i) => ({
  id: `FK7823${(20 + i).toString().padStart(2, "0")}`,
  drop: ["Sector 2, HSR", "27th Main, HSR", "5th Block, Koramangala", "Sector 6, HSR", "1st Sector, HSR"][i % 5],
  km: Number((1 + ((i * 7) % 25) / 10).toFixed(1)),
  minutes: 6 + (i % 7),
  payout: 38 + ((i * 9) % 34),
  tip: i % 4 === 0 ? 10 + (i % 3) * 5 : 0,
  time: `${9 + Math.floor(i / 2)}:${i % 2 ? "40" : "05"} ${9 + Math.floor(i / 2) >= 12 ? "PM" : "AM"}`,
  items: 3 + (i % 9),
}));

const riderReviews = [
  { id: "r1", customer: "Aarav Sharma", rating: 5, comment: "Reached before time and handled the bag carefully.", date: "Today" },
  { id: "r2", customer: "Diya Patel", rating: 5, comment: "Very polite rider, called before arriving.", date: "Today" },
  { id: "r3", customer: "Kabir Iyer", rating: 4, comment: "Good delivery, took a slightly longer route.", date: "Yesterday" },
  { id: "r4", customer: "Meera Nair", rating: 5, comment: "Fast and friendly, packaging intact.", date: "Yesterday" },
  { id: "r5", customer: "Rohan Das", rating: 5, comment: "Best rider in our area, always on time.", date: "2 days ago" },
  { id: "r6", customer: "Ishita Roy", rating: 3, comment: "Delivery was fine but had to wait at the gate.", date: "3 days ago" },
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

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`size-3.5 ${i < n ? "fill-offer text-offer" : "text-muted-foreground"}`} />
      ))}
    </span>
  );
}

export const Route = createFileRoute("/rider/")({
  head: () => ({
    meta: [
      { title: "Rider hub — FreshKart delivery partners" },
      { name: "description", content: "Rider dashboard for FreshKart partners: active trip, pickup queue, earnings and performance." },
      { property: "og:title", content: "Rider hub — FreshKart delivery partners" },
      { property: "og:description", content: "Track your active trip, accept nearby orders and watch your daily earnings grow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiderPage,
});

const earningsWeek = [
  { label: "Mon", value: 640, trips: 11, hours: 6.5, tips: 40 },
  { label: "Tue", value: 720, trips: 12, hours: 7, tips: 30 },
  { label: "Wed", value: 810, trips: 14, hours: 7.5, tips: 55 },
  { label: "Thu", value: 690, trips: 12, hours: 6.5, tips: 25 },
  { label: "Fri", value: 980, trips: 17, hours: 8.5, tips: 70 },
  { label: "Sat", value: 1240, trips: 21, hours: 9.5, tips: 110 },
  { label: "Sun", value: 1080, trips: 18, hours: 9, tips: 85 },
];

const initialQueue = [
  { id: "FK782344", store: "HSR Store 02", drop: "Sector 6, HSR Layout", km: 1.8, payout: 42, items: 6 },
  { id: "FK782347", store: "HSR Store 02", drop: "27th Main, HSR", km: 2.4, payout: 55, items: 3 },
  { id: "FK782351", store: "Koramangala Store", drop: "5th Block, Koramangala", km: 3.1, payout: 68, items: 11 },
];

const timeline = [
  { t: "2:12 PM", label: "Order assigned", done: true },
  { t: "2:15 PM", label: "Picked up from HSR Store 02", done: true },
  { t: "2:19 PM", label: "On the way to customer", done: true },
  { t: "2:24 PM", label: "Delivered", done: false },
];

type RiderModal = "earnings" | "deliveries" | "dropTime" | "rating" | null;

function RiderPage() {
  const { rider, canAcceptOrders } = usePartners();
  const { session } = usePartnerAuth();
  const id = session?.partnerId ?? "RDR-2001";
  const me = rider(id);
  const active = canAcceptOrders(id);
  const first = (me?.name ?? "Rider").split(" ")[0];
  const [queue, setQueue] = useState(initialQueue);
  const [modal, setModal] = useState<RiderModal>(null);
  const [day, setDay] = useState<string | null>(null);

  const tipsToday = useMemo(() => deliveriesToday.reduce((s, d) => s + d.tip, 0), []);
  const earnToday = useMemo(() => deliveriesToday.reduce((s, d) => s + d.payout + d.tip, 0), []);
  const avgDrop = useMemo(
    () => deliveriesToday.reduce((s, d) => s + d.minutes, 0) / deliveriesToday.length,
    [],
  );
  const weekTotal = earningsWeek.reduce((s, d) => s + d.value, 0);


  return (
    <ConsoleLayout
      badge="Rider"
      title={active ? `Hey ${first}, you're online` : `Hey ${first}, you're offline`}
      subtitle={active ? `${queue.length} orders in your queue · ${me?.zone ?? "HSR Layout"} zone` : "Account not verified · order acceptance is blocked"}
    >
      {!active && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-discount/40 bg-discount/10 p-4">
          {me && <StatusPill status={me.status} />}
          <p className="text-sm font-semibold text-discount">
            Your account isn't verified yet, so you can't accept orders. FreshKart admin will review your documents shortly.
          </p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Earnings today" value={`₹${(me?.earningsMonth ? Math.round(me.earningsMonth / 30) : 1286).toLocaleString("en-IN")}`} delta="+₹210" icon={IndianRupee} />
        <StatCard label="Deliveries today" value="14" icon={Bike} />
        <StatCard label="Avg drop time" value="8 min 40 s" icon={Timer} tone="offer" />
        <StatCard label="Rating" value={`${me?.rating ?? 4.9} ★`} icon={Star} tone="discount" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-primary-foreground shadow-lift">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider opacity-80">Active trip</div>
                <div className="font-display text-2xl font-black">FK782341</div>
                <div className="text-sm opacity-90 mt-1 flex items-center gap-1.5"><MapPin className="size-4" /> Sector 2, HSR Layout · 1.2 km away</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider opacity-80">Payout</div>
                <div className="font-display text-2xl font-black">₹48</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => toast.info("Opening navigation to Sector 2, HSR Layout")} className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur px-4 py-2.5 text-sm font-bold">
                <Navigation className="size-4" /> Navigate
              </button>
              <button onClick={() => toast.info("Calling customer…")} className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur px-4 py-2.5 text-sm font-bold">
                <Phone className="size-4" /> Call customer
              </button>
              <button onClick={() => toast.success("Trip FK782341 marked delivered")} className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2.5 text-sm font-bold text-primary">
                <CheckCircle2 className="size-4" /> Mark delivered
              </button>
            </div>
          </div>

          <Panel title="Trip timeline">
            <ol className="relative border-l pl-6 space-y-5">
              {timeline.map((s) => (
                <li key={s.label} className="relative">
                  <span className={`absolute -left-[31px] grid size-5 place-items-center rounded-full ${s.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <CheckCircle2 className="size-3" />
                  </span>
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.t}</div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Items in this bag">
            <div className="grid gap-3 sm:grid-cols-2">
              {products.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-surface text-xl">{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.weight}</div>
                  </div>
                  <Pill label="×1" />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Pickup queue" action={<Pill label="nearby" tone="primary" />}>
            {queue.length === 0 ? (
              <p className="text-sm text-muted-foreground">All nearby orders accepted. New pickups appear here automatically.</p>
            ) : (
              <ul className="space-y-3">
                {queue.map((q) => (
                  <li key={q.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold">{q.id}</span>
                      <span className="font-black text-sm">₹{q.payout}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{q.store} → {q.drop}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <Pill label={`${q.km} km · ${q.items} items`} />
                      <button
                        disabled={!active}
                        onClick={() => {
                          setQueue((list) => list.filter((x) => x.id !== q.id));
                          toast.success(`Accepted ${q.id} · ₹${q.payout} payout`);
                        }}
                        title={active ? undefined : "Verify your account to accept orders"}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                      >
                        Accept
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Earnings this week" action={<Pill label={inr(weekTotal)} tone="primary" />}>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsWeek} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }}
                    formatter={(v) => [inr(Number(v)), "Earnings"]}
                  />
                  <RBar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={30} onClick={(d: { label?: string }) => setDay(d?.label ?? null)}>
                    {earningsWeek.map((d) => (
                      <Cell key={d.label} fill={day === d.label ? "var(--color-offer-foreground)" : "var(--color-primary)"} className="cursor-pointer" />
                    ))}
                  </RBar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Tap a bar to see that day's breakdown.</p>
          </Panel>
        </div>
      </div>

      {modal === "earnings" && (
        <Modal title="Earnings today" subtitle={`${deliveriesToday.length} trips · ${inr(tipsToday)} in tips`} onClose={() => setModal(null)}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { k: "Trip payouts", v: inr(earnToday - tipsToday) },
              { k: "Customer tips", v: inr(tipsToday) },
              { k: "Total credited", v: inr(earnToday) },
            ].map((r) => (
              <div key={r.k} className="rounded-xl border bg-surface p-3">
                <div className="text-xs text-muted-foreground">{r.k}</div>
                <div className="font-display text-lg font-black">{r.v}</div>
              </div>
            ))}
          </div>
          <ul className="mt-4 divide-y rounded-xl border">
            {deliveriesToday.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold">{d.id}</div>
                  <div className="text-xs text-muted-foreground truncate">{d.time} · {d.drop}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold">{inr(d.payout + d.tip)}</div>
                  {d.tip > 0 && <div className="text-[11px] text-primary">incl. {inr(d.tip)} tip</div>}
                </div>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {modal === "deliveries" && (
        <Modal title="Deliveries today" subtitle={`${deliveriesToday.length} completed drops`} onClose={() => setModal(null)}>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Order</th>
                  <th className="p-3 text-left">Drop</th>
                  <th className="p-3 text-right">Distance</th>
                  <th className="p-3 text-right">Time</th>
                  <th className="p-3 text-right">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deliveriesToday.map((d) => (
                  <tr key={d.id}>
                    <td className="p-3 font-mono text-xs font-bold">{d.id}</td>
                    <td className="p-3">{d.drop}<div className="text-xs text-muted-foreground">{d.items} items · {d.time}</div></td>
                    <td className="p-3 text-right">{d.km} km</td>
                    <td className="p-3 text-right">{d.minutes} min</td>
                    <td className="p-3 text-right font-bold">{inr(d.payout + d.tip)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {modal === "dropTime" && (
        <Modal title="Average drop time" subtitle="Time from pickup to hand-over, today" onClose={() => setModal(null)}>
          <ul className="divide-y rounded-xl border">
            {deliveriesToday.map((d) => (
              <li key={d.id} className="flex items-center gap-3 p-3 text-sm">
                <span className="font-mono text-xs font-bold w-24">{d.id}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(d.minutes / 13) * 100}%` }} />
                </div>
                <span className="w-16 text-right font-semibold">{d.minutes} min</span>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {modal === "rating" && (
        <Modal title="Customer reviews" subtitle={`${me?.rating ?? 4.9} ★ average across ${riderReviews.length} recent ratings`} onClose={() => setModal(null)}>
          <ul className="space-y-3">
            {riderReviews.map((r) => (
              <li key={r.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{r.customer}</span>
                  <Stars n={r.rating} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                <div className="mt-1 text-[11px] text-muted-foreground">{r.date}</div>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {day && (
        <Modal title={`${day} earnings`} subtitle="Daily breakdown" onClose={() => setDay(null)}>
          {(() => {
            const d = earningsWeek.find((x) => x.label === day)!;
            return (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { k: "Total earnings", v: inr(d.value) },
                  { k: "Trips completed", v: `${d.trips}` },
                  { k: "Hours online", v: `${d.hours} h` },
                  { k: "Tips", v: inr(d.tips) },
                  { k: "Avg per trip", v: inr(Math.round(d.value / d.trips)) },
                  { k: "Avg per hour", v: inr(Math.round(d.value / d.hours)) },
                ].map((r) => (
                  <div key={r.k} className="rounded-xl border bg-surface p-3">
                    <div className="text-xs text-muted-foreground">{r.k}</div>
                    <div className="font-display text-lg font-black">{r.v}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Modal>
      )}
    </ConsoleLayout>
  );
}
