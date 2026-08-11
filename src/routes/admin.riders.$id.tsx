import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bike, IndianRupee, Star, Timer, Phone, Mail, MapPin } from "lucide-react";
import { ConsoleLayout, StatCard, Panel, Pill } from "@/components/console/ConsoleLayout";
import { PartnerActions, StatusPill, DocList } from "@/components/console/PartnerControls";
import { usePartners } from "@/context/PartnersContext";

export const Route = createFileRoute("/admin/riders/$id")({
  head: () => ({
    meta: [
      { title: "Rider profile — FreshKart admin" },
      { name: "description", content: "Review a FreshKart rider's documents, performance and verification status, then verify, discontinue or remove the account." },
      { property: "og:title", content: "Rider profile — FreshKart admin" },
      { property: "og:description", content: "Full rider account controls: verification, documents, trips and earnings." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiderDetail,
});

function RiderDetail() {
  const { id } = Route.useParams();
  const { rider } = usePartners();
  const r = rider(id);

  if (!r) {
    return (
      <ConsoleLayout badge="Admin" title="Rider not found" subtitle="This account may have been removed">
        <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary transition-colors">
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
      </ConsoleLayout>
    );
  }

  return (
    <ConsoleLayout badge="Admin · Rider" title={r.name} subtitle={`${r.id} · ${r.zone}, ${r.city} · joined ${r.joined}`}>
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="size-4" /> All riders
      </Link>

      <div className="mt-4 rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-full bg-primary-soft text-sm font-black text-primary">
              {r.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-display text-lg font-black">{r.name}</div>
              <div className="mt-1 flex items-center gap-2"><StatusPill status={r.status} /><Pill label={r.vehicle} /></div>
            </div>
          </div>
          <PartnerActions id={r.id} name={r.name} status={r.status} size="md" />
        </div>
        {r.status !== "verified" && (
          <p className="mt-4 rounded-xl bg-discount/10 p-3 text-xs font-semibold text-discount">
            {r.status === "pending"
              ? "Pending verification — this rider cannot accept any orders until verified."
              : "Account discontinued — order acceptance is blocked."}
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total trips" value={r.trips.toLocaleString("en-IN")} icon={Bike} />
        <StatCard label="Earnings (30d)" value={`₹${r.earningsMonth.toLocaleString("en-IN")}`} icon={IndianRupee} />
        <StatCard label="On-time rate" value={`${r.onTimeRate}%`} icon={Timer} tone="offer" />
        <StatCard label="Rating" value={`${r.rating} ★`} icon={Star} tone="discount" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Contact & vehicle">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" /> {r.phone}</li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" /> {r.email}</li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" /> {r.zone}, {r.city}</li>
            <li className="flex items-center justify-between border-t pt-3"><span className="text-muted-foreground">Vehicle</span><span className="font-semibold">{r.vehicle} · {r.plate}</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">Licence no.</span><span className="font-mono text-xs font-semibold">{r.licence}</span></li>
          </ul>
        </Panel>
        <Panel title="Documents">
          <DocList docs={r.documents} />
        </Panel>
      </div>
    </ConsoleLayout>
  );
}
