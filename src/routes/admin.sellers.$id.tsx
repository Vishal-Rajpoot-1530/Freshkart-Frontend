import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, IndianRupee, Package, Percent, Star, Phone, Mail, MapPin } from "lucide-react";
import { ConsoleLayout, StatCard, Panel, Pill } from "@/components/console/ConsoleLayout";
import { PartnerActions, StatusPill, DocList } from "@/components/console/PartnerControls";
import { usePartners } from "@/context/PartnersContext";

export const Route = createFileRoute("/admin/sellers/$id")({
  head: () => ({
    meta: [
      { title: "Seller profile — FreshKart admin" },
      { name: "description", content: "Review a FreshKart partner store's licences, catalogue size and performance, then verify, discontinue or remove the account." },
      { property: "og:title", content: "Seller profile — FreshKart admin" },
      { property: "og:description", content: "Full seller account controls: verification, documents, sales and cancellations." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SellerDetail,
});

function SellerDetail() {
  const { id } = Route.useParams();
  const { seller } = usePartners();
  const s = seller(id);

  if (!s) {
    return (
      <ConsoleLayout badge="Admin" title="Seller not found" subtitle="This account may have been removed">
        <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary transition-colors">
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
      </ConsoleLayout>
    );
  }

  return (
    <ConsoleLayout badge="Admin · Seller" title={s.store} subtitle={`${s.id} · ${s.area}, ${s.city} · onboarded ${s.onboarded}`}>
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="size-4" /> All sellers
      </Link>

      <div className="mt-4 rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-primary-soft text-sm font-black text-primary">
              {s.store.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-display text-lg font-black">{s.store}</div>
              <div className="mt-1 flex items-center gap-2"><StatusPill status={s.status} /><Pill label={`${s.skus} SKUs`} /></div>
            </div>
          </div>
          <PartnerActions id={s.id} name={s.store} status={s.status} size="md" />
        </div>
        {s.status !== "verified" && (
          <p className="mt-4 rounded-xl bg-discount/10 p-3 text-xs font-semibold text-discount">
            {s.status === "pending"
              ? "Pending verification — this store cannot accept incoming orders until verified."
              : "Account discontinued — catalogue is hidden and order acceptance is blocked."}
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sales (30d)" value={`₹${s.salesMonth.toLocaleString("en-IN")}`} icon={IndianRupee} />
        <StatCard label="Orders fulfilled" value={s.ordersFulfilled.toLocaleString("en-IN")} icon={Package} />
        <StatCard label="Store rating" value={`${s.rating} ★`} icon={Star} tone="offer" />
        <StatCard label="Cancellation rate" value={`${s.cancellationRate}%`} icon={Percent} tone="discount" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Business details">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" /> {s.phone}</li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" /> {s.email}</li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" /> {s.area}, {s.city}</li>
            <li className="flex items-center justify-between border-t pt-3"><span className="text-muted-foreground">Owner</span><span className="font-semibold">{s.owner}</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">GSTIN</span><span className="font-mono text-xs font-semibold">{s.gstin}</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">FSSAI</span><span className="font-mono text-xs font-semibold">{s.fssai}</span></li>
          </ul>
        </Panel>
        <Panel title="Documents">
          <DocList docs={s.documents} />
        </Panel>
      </div>
    </ConsoleLayout>
  );
}
