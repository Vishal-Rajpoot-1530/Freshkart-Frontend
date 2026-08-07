import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Bike, Store, ArrowLeft, Bell, Search } from "lucide-react";

const portals = [
  { to: "/admin" as const, label: "Admin", icon: LayoutDashboard },
  { to: "/rider" as const, label: "Rider", icon: Bike },
  { to: "/seller" as const, label: "Seller", icon: Store },
];

export function ConsoleLayout({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-40 glass border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
                <span className="text-lg font-black">F</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-lg font-black leading-none">FreshKart</div>
                <div className="text-[10px] text-muted-foreground">{badge} console</div>
              </div>
            </Link>

            <nav className="ml-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
              {portals.map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  activeProps={{ className: "bg-primary-soft text-primary" }}
                  inactiveProps={{ className: "text-muted-foreground hover:bg-muted" }}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                >
                  <p.icon className="size-4" /> {p.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <label className="hidden md:flex items-center gap-2 rounded-xl border bg-card px-3 py-2 focus-within:border-primary transition-colors">
                <Search className="size-4 text-muted-foreground" />
                <input
                  placeholder="Search orders, SKUs…"
                  aria-label="Search console"
                  className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <button className="grid size-10 place-items-center rounded-xl hover:bg-muted relative" aria-label="Notifications">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-discount" />
              </button>
              <Link
                to="/"
                className="flex items-center gap-1.5 rounded-xl border bg-card px-3 py-2 text-xs font-semibold hover:border-primary transition-colors"
              >
                <ArrowLeft className="size-3.5" /> <span className="hidden sm:inline">Storefront</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                {badge}
              </div>
              <h1 className="mt-2 font-display text-3xl font-black">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="text-xs text-muted-foreground">Updated just now · demo data</div>
          </div>
          <div className="mt-6">{children}</div>
        </motion.div>
      </main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "offer" | "discount";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    offer: "bg-offer/20 text-offer-foreground",
    discount: "bg-discount/10 text-discount",
  } as const;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </div>
        {delta && <span className="text-xs font-bold text-primary">{delta}</span>}
      </div>
      <div className="mt-4 font-display text-2xl font-black">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-lg font-black">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Pill({ label, tone = "muted" }: { label: string; tone?: "muted" | "primary" | "offer" | "discount" }) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary-soft text-primary",
    offer: "bg-offer/25 text-offer-foreground",
    discount: "bg-discount/10 text-discount",
  } as const;
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{label}</span>;
}

export function Bars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ duration: 0.6 }}
            className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary"
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
