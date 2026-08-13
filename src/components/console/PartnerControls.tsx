import { useCallback, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { BadgeCheck, Ban, Trash2, ChevronRight, RotateCcw } from "lucide-react";
import { Pill } from "@/components/console/ConsoleLayout";
import { statusLabel, statusTone, type PartnerStatus } from "@/data/partners";
import { usePartners } from "@/context/PartnersContext";
import {
  ConfirmDialog,
  PartnerFilterBar,
  lastActiveLabel,
  usePartnerFilters,
} from "@/components/console/PartnerFilters";

export function StatusPill({ status }: { status: PartnerStatus }) {
  return <Pill label={statusLabel[status]} tone={statusTone[status]} />;
}

type BulkAction = "verified" | "suspended" | "pending" | "remove";

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
  const [pending, setPending] = useState<BulkAction | null>(null);
  const pad = size === "md" ? "px-4 py-2.5 text-sm" : "px-2.5 py-1.5 text-xs";

  const run = () => {
    if (pending === "verified") { setStatus(id, "verified"); toast.success(`${name} verified — can now accept orders`); }
    if (pending === "suspended") { setStatus(id, "suspended"); toast.warning(`${name} discontinued — order access revoked`); }
    if (pending === "pending") { setStatus(id, "pending"); toast.info(`${name} moved back to pending review`); }
    if (pending === "remove") { removePartner(id); toast.error(`${name} account removed`); }
    setPending(null);
  };

  const copy: Record<BulkAction, { title: string; body: string; label: string; danger?: boolean }> = {
    verified: { title: "Verify account?", body: `${name} will be able to accept orders immediately.`, label: "Verify" },
    suspended: { title: "Discontinue account?", body: `${name} will be blocked from accepting any new orders.`, label: "Discontinue", danger: true },
    pending: { title: "Reinstate account?", body: `${name} goes back to pending review and stays blocked until verified.`, label: "Reinstate" },
    remove: { title: "Remove account?", body: `${name} will be permanently removed from the platform.`, label: "Remove", danger: true },
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "verified" && (
        <button
          onClick={() => setPending("verified")}
          className={`inline-flex items-center gap-1.5 rounded-lg bg-primary font-bold text-primary-foreground ${pad}`}
        >
          <BadgeCheck className="size-3.5" /> Verify
        </button>
      )}
      {status !== "suspended" && (
        <button
          onClick={() => setPending("suspended")}
          className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold hover:border-discount hover:text-discount transition-colors ${pad}`}
        >
          <Ban className="size-3.5" /> Discontinue
        </button>
      )}
      {status === "suspended" && (
        <button
          onClick={() => setPending("pending")}
          className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold hover:border-primary transition-colors ${pad}`}
        >
          Reinstate
        </button>
      )}
      <button
        onClick={() => setPending("remove")}
        className={`inline-flex items-center gap-1.5 rounded-lg bg-discount/10 font-semibold text-discount ${pad}`}
      >
        <Trash2 className="size-3.5" /> Remove
      </button>

      <ConfirmDialog
        open={pending !== null}
        title={pending ? copy[pending].title : ""}
        body={pending ? copy[pending].body : ""}
        confirmLabel={pending ? copy[pending].label : ""}
        danger={pending ? copy[pending].danger : false}
        onConfirm={run}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

function useBulk(label: string) {
  const { setStatus, removePartner } = usePartners();
  const [selected, setSelected] = useState<string[]>([]);
  const [action, setAction] = useState<BulkAction | null>(null);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = (ids: string[]) =>
    setSelected((s) => (ids.every((id) => s.includes(id)) ? s.filter((id) => !ids.includes(id)) : ids));

  const run = () => {
    if (!action) return;
    const n = selected.length;
    if (action === "remove") {
      selected.forEach((id) => removePartner(id));
      toast.error(`${n} ${label} removed`);
    } else {
      selected.forEach((id) => setStatus(id, action));
      const verb = action === "verified" ? "verified" : action === "suspended" ? "discontinued" : "moved to pending";
      toast.success(`${n} ${label} ${verb}`);
    }
    setSelected([]);
    setAction(null);
  };

  const copy: Record<BulkAction, { title: string; label: string; danger?: boolean }> = {
    verified: { title: `Verify ${selected.length} ${label}?`, label: "Verify all" },
    suspended: { title: `Discontinue ${selected.length} ${label}?`, label: "Discontinue all", danger: true },
    pending: { title: `Reinstate ${selected.length} ${label}?`, label: "Reinstate all" },
    remove: { title: `Remove ${selected.length} ${label}?`, label: "Remove all", danger: true },
  };

  const bar = selected.length > 0 && (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/40 bg-primary-soft p-3">
      <span className="text-xs font-bold text-primary">{selected.length} selected</span>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <button
          onClick={() => setAction("verified")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground"
        >
          <BadgeCheck className="size-3.5" /> Verify
        </button>
        <button
          onClick={() => setAction("suspended")}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1.5 text-xs font-semibold hover:border-discount hover:text-discount transition-colors"
        >
          <Ban className="size-3.5" /> Discontinue
        </button>
        <button
          onClick={() => setAction("pending")}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1.5 text-xs font-semibold hover:border-primary transition-colors"
        >
          <RotateCcw className="size-3.5" /> Pending
        </button>
        <button
          onClick={() => setAction("remove")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-discount/10 px-2.5 py-1.5 text-xs font-bold text-discount"
        >
          <Trash2 className="size-3.5" /> Remove
        </button>
        <button
          onClick={() => setSelected([])}
          className="rounded-lg px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      </div>
      <ConfirmDialog
        open={action !== null}
        title={action ? copy[action].title : ""}
        body={
          action === "remove"
            ? `This permanently removes ${selected.length} ${label} from the platform.`
            : action === "verified"
              ? `These ${label} will be able to accept orders immediately.`
              : `These ${label} stay blocked from accepting orders until verified again.`
        }
        confirmLabel={action ? copy[action].label : ""}
        danger={action ? copy[action].danger : false}
        onConfirm={run}
        onCancel={() => setAction(null)}
      />
    </div>
  );

  return { selected, toggle, toggleAll, bar };
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="size-4 accent-primary cursor-pointer"
    />
  );
}

export function SellerRows() {
  const { sellers } = usePartners();
  const searchOf = useCallback(
    (s: (typeof sellers)[number]) => `${s.store} ${s.owner} ${s.id} ${s.area} ${s.city} ${s.email}`,
    [],
  );
  const { filters, setFilters, filtered, cities, dirty, reset } = usePartnerFilters(sellers, searchOf);
  const { selected, toggle, toggleAll, bar } = useBulk("sellers");
  const ids = filtered.map((s) => s.id);

  return (
    <div>
      <PartnerFilterBar
        label="sellers"
        filters={filters}
        setFilters={setFilters}
        cities={cities}
        dirty={dirty}
        reset={reset}
        count={filtered.length}
        total={sellers.length}
      />
      {bar}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 w-8">
                <Check
                  checked={ids.length > 0 && ids.every((id) => selected.includes(id))}
                  onChange={() => toggleAll(ids)}
                  label="Select all sellers"
                />
              </th>
              <th className="py-2 font-semibold">Store</th>
              <th className="py-2 font-semibold hidden md:table-cell">Area</th>
              <th className="py-2 font-semibold hidden lg:table-cell">Last active</th>
              <th className="py-2 font-semibold hidden sm:table-cell">Sales (30d)</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2 font-semibold text-right">Controls</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t align-middle">
                <td className="py-3">
                  <Check checked={selected.includes(s.id)} onChange={() => toggle(s.id)} label={`Select ${s.store}`} />
                </td>
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
                <td className="py-3 hidden lg:table-cell text-muted-foreground">{lastActiveLabel(s.lastActiveDays)}</td>
                <td className="py-3 hidden sm:table-cell font-semibold">₹{s.salesMonth.toLocaleString("en-IN")}</td>
                <td className="py-3"><StatusPill status={s.status} /></td>
                <td className="py-3">
                  <div className="flex justify-end"><PartnerActions id={s.id} name={s.store} status={s.status} /></div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-sm text-muted-foreground">No sellers match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RiderList() {
  const { riders } = usePartners();
  const searchOf = useCallback(
    (r: (typeof riders)[number]) => `${r.name} ${r.id} ${r.zone} ${r.city} ${r.vehicle} ${r.email}`,
    [],
  );
  const { filters, setFilters, filtered, cities, dirty, reset } = usePartnerFilters(riders, searchOf);
  const { selected, toggle, toggleAll, bar } = useBulk("riders");
  const ids = filtered.map((r) => r.id);

  return (
    <div>
      <PartnerFilterBar
        label="riders"
        filters={filters}
        setFilters={setFilters}
        cities={cities}
        dirty={dirty}
        reset={reset}
        count={filtered.length}
        total={riders.length}
      />
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Check
          checked={ids.length > 0 && ids.every((id) => selected.includes(id))}
          onChange={() => toggleAll(ids)}
          label="Select all riders"
        />
        Select all
      </div>
      {bar}
      <ul className="space-y-3">
        {filtered.map((r) => (
          <li key={r.id} className="flex items-center gap-2 rounded-xl border p-3">
            <Check checked={selected.includes(r.id)} onChange={() => toggle(r.id)} label={`Select ${r.name}`} />
            <Link to="/admin/riders/$id" params={{ id: r.id }} className="flex flex-1 items-center gap-3 min-w-0 group">
              <div className="grid size-9 place-items-center rounded-full bg-primary-soft text-xs font-black text-primary">
                {r.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {r.zone} · ★ {r.rating} · {lastActiveLabel(r.lastActiveDays)}
                </div>
              </div>
              <StatusPill status={r.status} />
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
        {filtered.length === 0 && <li className="text-sm text-muted-foreground">No riders match these filters.</li>}
      </ul>
    </div>
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
