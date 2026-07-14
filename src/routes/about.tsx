import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Zap, Heart, Rocket, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — FreshKart" },
      { name: "description", content: "FreshKart is on a mission to reinvent everyday grocery shopping with speed, quality and care." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <span className="inline-block rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-semibold">Our story</span>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-black leading-tight">Reinventing the trip to the store.</h1>
        <p className="mt-4 text-lg text-muted-foreground">FreshKart was born in a Bengaluru kitchen out of a simple frustration: why should stocking up on essentials take an hour when it can take ten minutes?</p>

        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <Card icon={Rocket} title="Our mission" body="Make quality groceries accessible to every home, delivered faster than a coffee run — every single day." />
          <Card icon={Heart} title="Our promise" body="Handpicked freshness, transparent pricing, no surprises. If it isn't perfect, we replace it, no questions asked." />
          <Card icon={Users} title="Our people" body="From micro-warehouses to riders to product designers — 4,000+ teammates obsessed with reliability." />
          <Card icon={Zap} title="Our impact" body="2M+ households served, 40M+ orders delivered in under 15 minutes across 12 Indian cities." />
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-primary to-emerald-700 p-8 text-white shadow-lift">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <Stat n="10 min" l="Avg delivery" />
            <Stat n="10,000+" l="Products" />
            <Stat n="2M+" l="Happy customers" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Card({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-soft">
      <div className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" /></div>
      <div className="mt-3 font-bold text-lg">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
function Stat({ n, l }: { n: string; l: string }) {
  return <div><div className="font-display text-4xl font-black">{n}</div><div className="text-sm opacity-90 mt-1">{l}</div></div>;
}
