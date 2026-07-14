import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Check, Package, Bike } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({ meta: [{ title: `Order ${params.id} — FreshKart` }] }),
  component: TrackingPage,
});

const steps = [
  { icon: Check, title: "Order confirmed", time: "Just now", done: true },
  { icon: Package, title: "Packed at FreshKart hub", time: "In 2 min", done: true },
  { icon: Bike, title: "Out for delivery", time: "In 4 min", done: false, active: true },
  { icon: MapPin, title: "Delivered", time: "In 10 min", done: false },
];

function TrackingPage() {
  const { id } = Route.useParams();
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground">← All orders</Link>
        <h1 className="mt-2 font-display text-3xl font-black">Live tracking</h1>
        <p className="text-sm text-muted-foreground">Order {id}</p>

        <div className="mt-6 aspect-[16/9] rounded-2xl border bg-gradient-to-br from-primary-soft to-emerald-100 relative overflow-hidden shadow-soft">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_30%,white,transparent),radial-gradient(circle_at_80%_60%,white,transparent)]" />
          <div className="absolute inset-0 grid place-items-center">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-6xl">🛵</motion.div>
          </div>
          <div className="absolute bottom-4 left-4 glass rounded-xl px-3 py-2 text-xs font-semibold">Rider is 500m away · ETA 6 min</div>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-5 shadow-soft flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground font-bold">RK</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">Rahul K.</div>
            <div className="text-xs text-muted-foreground">Your delivery partner · ⭐ 4.9</div>
          </div>
          <button aria-label="Call" className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><Phone className="size-4" /></button>
          <button aria-label="Chat" className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><MessageCircle className="size-4" /></button>
        </div>

        <ol className="mt-6 space-y-4">
          {steps.map((s, i) => {
            const I = s.icon;
            return (
              <li key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`grid size-10 place-items-center rounded-full ${s.done || s.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <I className="size-4" />
                  </div>
                  {i < steps.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${s.done ? "bg-primary" : "bg-border"}`} />}
                </div>
                <div className="pb-6">
                  <div className={`font-semibold ${s.active ? "text-primary" : ""}`}>{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.time}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </AppLayout>
  );
}
