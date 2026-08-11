import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { BadgeCheck, Ban, Trash2, ChevronRight } from "lucide-react";
import { Pill } from "@/components/console/ConsoleLayout";
import { statusLabel, statusTone, type PartnerStatus } from "@/data/partners";
import { usePartners } from "@/context/PartnersContext";

export function StatusPill({ status }: { status: PartnerStatus }) {
  return <Pill label={statusLabel[status]} tone={statusTone[status]} />;
}

export function PartnerActions({
  id,
  name,
  status,
  size = "sm",
}: {
  id: string;
  name: string;
  status: PartnerStatus;
  size?: "sm" | "md";
}) {
  const { setStatus, removePartner } = usePartners();
  const pad = size === "md" ? "px-4 py-2.5 text-sm" : "px-2.5 py-1.5 text-xs";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "verified" && (
        <button
          onClick={() => { setStatus(id, "verified"); toast.success(`${name} verified — can now accept orders`); }}
          className={`inline-flex items-center gap-1.5 rounded-lg bg-primary font-bold text-primary-foreground ${pad}`}
        >
          <BadgeCheck className="size-3.5" /> Verify
        </button>
      )}
      {status !== "suspended" && (
        <button
          onClick={() => { setStatus(id, "suspended"); toast.warning(`${name} discontinued — order access revoked`); }}
          className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold hover:border-discount hover:text-discount transition-colors ${pad}`}
        >
          <Ban className="size-3.5" /> Discontinue
        </button>
      )}
      {status === "suspended" && (
        <button
          onClick={() => { setStatus(id, "pending"); toast.info(`${name} moved back to pending review`); }}
          className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold hover:border-primary transition-colors ${pad}`}
        >
          Reinstate
        </button>
      )}
      <button
        onClick={() => { removePartner(id); toast.error(`${name} account removed`); }}
        className={`inline-flex items-center gap-1.5 rounded-lg bg-discount/10 font-semibold text-discount ${pad}`}
      >
        <Trash2 className="size-3.5" /> Remove
      </button>
    </div>
  );
}

export function SellerRows() {
  const { sellers } = usePartners();
  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="py-2 font-semibold">Store</th>
            <th className="py-2 font-semibold hidden md:table-cell">Area</th>
            <th className="py-2 font-semibold hidden sm:table-cell">Sales (30d)</th>
            <th className="py-2 font-semibold">Status</th>
            <th className="py-2 font-semibold text-right">Controls</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s) => (
            <tr key={s.id} className="border-t align-middle">
              <td className="py-3">
                <Link to="/admin/sellers/$id" params={{ id: s.id }} className="group flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-xs font-black text-primary">
                    {s.store.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate group-hover:text-primary transition-colors">{s.store}</div>
                    <div className="text-xs text-muted-foreground">{s.owner} · ★ {s.rating}</div>
                  </div>
                </Link>
              </td>
              <td className="py-3 hidden md:table-cell text-muted-foreground">{s.area}</td>
              <td className="py-3 hidden sm:table-cell font-semibold">₹{s.salesMonth.toLocaleString("en-IN")}</td>
              <td className="py-3"><StatusPill status={s.status} /></td>
              <td className="py-3">
                <div className="flex justify-end"><PartnerActions id={s.id} name={s.store} status={s.status} /></div>
              </td>
            </tr>
          ))}
          {sellers.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No seller accounts.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function RiderList() {
  const { riders } = usePartners();
  return (
    <ul className="space-y-3">
      {riders.map((r) => (
        <li key={r.id}>
          <Link
            to="/admin/riders/$id"
            params={{ id: r.id }}
            className="flex items-center gap-3 rounded-xl border p-3 hover:border-primary transition-colors"
          >
            <div className="grid size-9 place-items-center rounded-full bg-primary-soft text-xs font-black text-primary">
              {r.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{r.name}</div>
              <div className="text-xs text-muted-foreground truncate">{r.zone} · {r.trips} trips · ★ {r.rating}</div>
            </div>
            <StatusPill status={r.status} />
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </li>
      ))}
      {riders.length === 0 && <li className="text-sm text-muted-foreground">No rider accounts.</li>}
    </ul>
  );
}

export function DocList({ docs }: { docs: { name: string; verified: boolean }[] }) {
  return (
    <ul className="space-y-2">
      {docs.map((d) => (
        <li key={d.name} className="flex items-center justify-between rounded-xl border p-3 text-sm">
          <span className="font-medium">{d.name}</span>
          <Pill label={d.verified ? "Verified" : "Missing"} tone={d.verified ? "primary" : "discount"} />
        </li>
      ))}
    </ul>
  );
}
