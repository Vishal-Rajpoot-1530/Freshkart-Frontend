import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, LogOut, CheckCheck } from "lucide-react";
import { usePartnerAuth } from "@/context/PartnerAuthContext";

const consoleNotifications: Record<string, { id: string; title: string; body: string; time: string }[]> = {
  Rider: [
    { id: "n1", title: "New pickup nearby", body: "FK782344 · HSR Store 02 · ₹42 payout", time: "just now" },
    { id: "n2", title: "Incentive unlocked", body: "Complete 4 more drops for a ₹120 bonus.", time: "18 min ago" },
    { id: "n3", title: "Payout credited", body: "₹5,160 for last week sent to your account.", time: "Yesterday" },
  ],
  Seller: [
    { id: "n1", title: "New order received", body: "FK782390 · 6 items · pack before 4:30 PM", time: "just now" },
    { id: "n2", title: "Low stock alert", body: "3 SKUs are below the reorder level.", time: "42 min ago" },
    { id: "n3", title: "Payout scheduled", body: "Next settlement lands on Friday.", time: "Yesterday" },
  ],
  Admin: [
    { id: "n1", title: "3 partners pending review", body: "2 riders and 1 seller await verification.", time: "just now" },
    { id: "n2", title: "SLA breach", body: "Koramangala store average drop time is 14 min.", time: "1 h ago" },
    { id: "n3", title: "Weekly report ready", body: "Operations summary for last week is available.", time: "Yesterday" },
  ],
};

function NotificationBell({ badge }: { badge: string }) {
  const [open, setOpen] = useState(false);
  const items = consoleNotifications[badge] ?? consoleNotifications.Admin;
  const [readIds, setReadIds] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const unread = items.filter((i) => !readIds.includes(i.id)).length;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-xl hover:bg-muted relative"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell className="size-5" />
        {unread > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-discount" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border bg-card p-3 shadow-lift z-50"
          >
            <div className="flex items-center justify-between gap-2 pb-2">
              <span className="font-display text-sm font-black">Notifications</span>
              <button
                onClick={() => setReadIds(items.map((i) => i.id))}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
              >
                <CheckCheck className="size-3.5" /> Mark all read
              </button>
            </div>
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {items.map((n) => {
                const isRead = readIds.includes(n.id);
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => setReadIds((r) => (r.includes(n.id) ? r : [...r, n.id]))}
                      className={`w-full text-left rounded-xl border p-3 transition-colors hover:border-primary ${isRead ? "opacity-60" : "bg-surface"}`}
                    >
                      <div className="flex items-center gap-2">
                        {!isRead && <span className="size-1.5 rounded-full bg-primary shrink-0" />}
                        <span className="text-sm font-semibold">{n.title}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SessionButton() {
  const { session, signOut } = usePartnerAuth();
  const router = useRouter();
  if (!session) return null;
  return (
    <button
      onClick={() => {
        const to = session.role === "seller" ? "/seller/login" : "/rider/login";
        signOut();
        router.navigate({ to });
      }}
      className="flex items-center gap-1.5 rounded-xl border bg-card px-3 py-2 text-xs font-semibold hover:border-primary transition-colors"
      aria-label="Sign out of partner console"
    >
      <LogOut className="size-3.5" /> <span className="hidden sm:inline">Sign out</span>
    </button>
  );
}

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
    <div className="min-h-dvh bg-surface flex flex-col">
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

            <div className="ml-auto flex items-center gap-1">
              <label className="hidden md:flex items-center gap-2 rounded-xl border bg-card px-3 py-2 focus-within:border-primary transition-colors">
                <Search className="size-4 text-muted-foreground" />
                <input
                  placeholder="Search orders, SKUs…"
                  aria-label="Search console"
                  className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <NotificationBell badge={badge} />
              <SessionButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-16">
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

      <ConsoleFooter badge={badge} />
    </div>
  );
}

export function ConsoleFooter({ badge }: { badge: string }) {
  const groups = [
    {
      title: "Consoles",
      links: [
        { to: "/admin" as const, label: "Admin dashboard" },
        { to: "/seller" as const, label: "Seller centre" },
        { to: "/rider" as const, label: "Rider hub" },
      ],
    },
    {
      title: "Partner resources",
      links: [
        { to: "/help" as const, label: "Help centre" },
        { to: "/contact" as const, label: "Contact support" },
        { to: "/about" as const, label: "About FreshKart" },
      ],
    },
    {
      title: "Storefront",
      links: [
        { to: "/" as const, label: "Home" },
        { to: "/orders" as const, label: "Orders" },
        { to: "/notifications" as const, label: "Notifications" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-black">F</div>
              <div>
                <div className="font-display text-lg font-black leading-none">FreshKart</div>
                <div className="text-[10px] text-muted-foreground">{badge} console</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground max-w-xs">
              Partner tooling for stores, riders and operations teams. All figures shown are demo data.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.title}</div>
              <ul className="mt-3 space-y-2 text-sm">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} FreshKart Retail Pvt Ltd · Partner platform</span>
          <span>Support: partners@freshkart.in · 1800 123 4567</span>
        </div>
      </div>
    </footer>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
  onClick,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "offer" | "discount";
  onClick?: () => void;
  hint?: string;
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    offer: "bg-offer/20 text-offer-foreground",
    discount: "bg-discount/10 text-discount",
  } as const;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </div>
        {delta && <span className="text-xs font-bold text-primary">{delta}</span>}
      </div>
      <div className="mt-4 font-display text-2xl font-black">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {onClick && <div className="mt-2 text-[11px] font-semibold text-primary">{hint ?? "View details"} →</div>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left rounded-2xl border bg-card p-5 shadow-soft transition-all hover:border-primary hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {body}
      </button>
    );
  }

  return <div className="rounded-2xl border bg-card p-5 shadow-soft">{body}</div>;
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
