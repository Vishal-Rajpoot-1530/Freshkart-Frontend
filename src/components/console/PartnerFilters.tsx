import { useMemo, useState, type ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { statusLabel, type PartnerStatus } from "@/data/partners";

export type PartnerFilterState = {
  q: string;
  status: PartnerStatus | "all";
  city: string;
  rating: string;
  active: string;
};

const empty: PartnerFilterState = { q: "", status: "all", city: "all", rating: "all", active: "all" };

const ratingOptions = [
  { value: "all", label: "Any rating" },
  { value: "4.8", label: "4.8★ & up" },
  { value: "4.5", label: "4.5★ & up" },
  { value: "4", label: "4.0★ & up" },
  { value: "0-4", label: "Below 4.0★" },
];

const activeOptions = [
  { value: "all", label: "Any activity" },
  { value: "0", label: "Active today" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "stale", label: "Inactive 14+ days" },
];

export function lastActiveLabel(days: number) {
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

type Filterable = {
  id: string;
  city: string;
  rating: number;
  lastActiveDays: number;
  status: PartnerStatus;
};

export function usePartnerFilters<T extends Filterable>(list: T[], searchOf: (item: T) => string) {
  const [filters, setFilters] = useState<PartnerFilterState>(empty);

  const cities = useMemo(() => Array.from(new Set(list.map((p) => p.city))).sort(), [list]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return list.filter((p) => {
      if (q && !searchOf(p).toLowerCase().includes(q)) return false;
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.city !== "all" && p.city !== filters.city) return false;
      if (filters.rating === "0-4" && p.rating >= 4) return false;
      if (filters.rating !== "all" && filters.rating !== "0-4" && p.rating < Number(filters.rating)) return false;
      if (filters.active === "stale" && p.lastActiveDays < 14) return false;
      if (filters.active !== "all" && filters.active !== "stale" && p.lastActiveDays > Number(filters.active))
        return false;
      return true;
    });
  }, [list, filters, searchOf]);

  const dirty = JSON.stringify(filters) !== JSON.stringify(empty);

  return { filters, setFilters, filtered, cities, dirty, reset: () => setFilters(empty) };
}

const selectCls =
  "rounded-lg border bg-card px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary transition-colors";

export function PartnerFilterBar({
  label,
  filters,
  setFilters,
  cities,
  dirty,
  reset,
  count,
  total,
}: {
  label: string;
  filters: PartnerFilterState;
  setFilters: (f: PartnerFilterState) => void;
  cities: string[];
  dirty: boolean;
  reset: () => void;
  count: number;
  total: number;
}) {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex flex-1 min-w-[190px] items-center gap-2 rounded-lg border bg-card px-3 py-2 focus-within:border-primary transition-colors">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder={`Search ${label}…`}
            aria-label={`Search ${label}`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as PartnerStatus | "all" })}
          className={selectCls}
        >
          <option value="all">All statuses</option>
          {(["verified", "pending", "suspended"] as PartnerStatus[]).map((s) => (
            <option key={s} value={s}>{statusLabel[s]}</option>
          ))}
        </select>
        <select
          aria-label="Filter by city"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className={selectCls}
        >
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          aria-label="Filter by rating"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          className={selectCls}
        >
          {ratingOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          aria-label="Filter by last active"
          value={filters.active}
          onChange={(e) => setFilters({ ...filters, active: e.target.value })}
          className={selectCls}
        >
          {activeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {dirty && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-semibold hover:border-primary transition-colors"
          >
            <X className="size-3.5" /> Clear
          </button>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <SlidersHorizontal className="size-3.5" /> Showing {count} of {total} {label}
      </p>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-5 shadow-soft">
        <h3 className="font-display text-lg font-black">{title}</h3>
        <div className="mt-2 text-sm text-muted-foreground">{body}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border px-3 py-2 text-sm font-semibold hover:border-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-3 py-2 text-sm font-bold ${
              danger ? "bg-discount text-discount-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
