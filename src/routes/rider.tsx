import { createFileRoute } from "@tanstack/react-router";
import { Bike, IndianRupee, Timer, Navigation, MapPin, Phone, CheckCircle2, Star } from "lucide-react";
import { ConsoleLayout, StatCard, Panel, Pill, Bars } from "@/components/console/ConsoleLayout";
import { products } from "@/data/products";
import { usePartners } from "@/context/PartnersContext";
import { StatusPill } from "@/components/console/PartnerControls";

export const Route = createFileRoute("/rider")({
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
  { label: "Mon", value: 640 }, { label: "Tue", value: 720 }, { label: "Wed", value: 810 },
  { label: "Thu", value: 690 }, { label: "Fri", value: 980 }, { label: "Sat", value: 1240 }, { label: "Sun", value: 1080 },
];

const queue = [
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

function RiderPage() {
  const { rider, canAcceptOrders } = usePartners();
  const me = rider("RDR-2001");
  const active = canAcceptOrders("RDR-2001");
  return (
    <ConsoleLayout
      badge="Rider"
      title={active ? "Hey Imran, you're online" : "Hey Imran, you're offline"}
      subtitle={active ? "3 orders in your queue · HSR Layout zone" : "Account not verified · order acceptance is blocked"}
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
        <StatCard label="Earnings today" value="₹1,286" delta="+₹210" icon={IndianRupee} />
        <StatCard label="Deliveries today" value="14" icon={Bike} />
        <StatCard label="Avg drop time" value="8 min 40 s" icon={Timer} tone="offer" />
        <StatCard label="Rating" value="4.9 ★" icon={Star} tone="discount" />
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
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur px-4 py-2.5 text-sm font-bold">
                <Navigation className="size-4" /> Navigate
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur px-4 py-2.5 text-sm font-bold">
                <Phone className="size-4" /> Call customer
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2.5 text-sm font-bold text-primary">
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
                      title={active ? undefined : "Verify your account to accept orders"}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                    >
                      Accept
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Earnings this week" action={<Pill label="₹5,160" tone="primary" />}>
            <Bars data={earningsWeek} />
          </Panel>
        </div>
      </div>
    </ConsoleLayout>
  );
}
