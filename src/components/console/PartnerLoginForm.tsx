import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, Store, Bike, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { usePartnerAuth, type PartnerRole } from "@/context/PartnerAuthContext";
import { usePartners } from "@/context/PartnersContext";
import { statusLabel } from "@/data/partners";

const copy = {
  seller: {
    icon: Store,
    heading: "Seller centre login",
    sub: "Manage your catalogue, orders and payouts.",
    accent: "from-primary via-emerald-600 to-green-700",
    art: "🏪",
    tagline: "Sell more, every 10 minutes.",
    blurb: "Over 42,000 partner stores use FreshKart Seller Centre to run their daily inventory and payouts.",
    to: "/seller" as const,
    other: { to: "/rider/login" as const, label: "Are you a delivery rider? Rider login" },
  },
  rider: {
    icon: Bike,
    heading: "Rider hub login",
    sub: "Go online, pick up trips and track earnings.",
    accent: "from-emerald-700 via-teal-600 to-primary",
    art: "🛵",
    tagline: "Your next trip is one tap away.",
    blurb: "Flexible shifts, daily payouts and zone-based incentives for 180,000+ FreshKart riders.",
    to: "/rider" as const,
    other: { to: "/seller/login" as const, label: "Run a store instead? Seller login" },
  },
} as const;

export function PartnerLoginForm({ role }: { role: PartnerRole }) {
  const c = copy[role];
  const Icon = c.icon;
  const { signIn } = usePartnerAuth();
  const { sellers, riders } = usePartners();
  const accounts = role === "seller" ? sellers : riders;
  const [selected, setSelected] = useState(accounts[0]?.id ?? "");
  const [email, setEmail] = useState(accounts[0]?.email ?? "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const pick = (id: string) => {
    setSelected(id);
    const acc = accounts.find((a) => a.id === id);
    if (acc) setEmail(acc.email);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const acc = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!acc) return setError(`No ${role} account found for that email. Pick a demo account below.`);
    if (password.trim().length < 4) return setError("Password must be at least 4 characters.");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 500));
    signIn({
      role,
      partnerId: acc.id,
      name: "store" in acc ? acc.store : acc.name,
      email: acc.email,
    });
    setBusy(false);
    toast.success(`Signed in as ${"store" in acc ? acc.store : acc.name}`);
    router.navigate({ to: c.to });
  };

  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-background">
      <div className={`hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br ${c.accent} text-white relative overflow-hidden`}>
        <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="grid size-10 place-items-center rounded-xl bg-white text-primary font-black">F</div>
          <div>
            <div className="font-display text-xl font-black leading-none">FreshKart</div>
            <div className="text-[11px] uppercase tracking-wider text-white/80">Partner platform</div>
          </div>
        </Link>
        <div className="relative">
          <div className="text-6xl">{c.art}</div>
          <h2 className="mt-4 font-display text-3xl font-black leading-tight">{c.tagline}</h2>
          <p className="mt-3 max-w-md text-white/80">{c.blurb}</p>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-white/75">
          <ShieldCheck className="size-4" /> Partner accounts are reviewed by FreshKart operations.
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Icon className="size-4" /> {role} access
          </div>
          <h1 className="mt-3 font-display text-3xl font-black">{c.heading}</h1>
          <p className="text-sm text-muted-foreground">{c.sub}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <div className="text-xs font-semibold mb-1.5">Registered {role} email</div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full rounded-xl border bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  placeholder={role === "seller" ? "store@example.in" : "rider@freshkart.rider"}
                />
              </div>
            </label>
            <label className="block">
              <div className="text-xs font-semibold mb-1.5">Password</div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  required
                  className="w-full rounded-xl border bg-background py-3 pl-10 pr-10 text-sm outline-none focus:border-primary"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            {error && <div className="rounded-xl border border-discount/40 bg-discount/10 p-3 text-xs font-semibold text-discount">{error}</div>}

            <button
              disabled={busy}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lift disabled:opacity-60"
            >
              {busy ? "Signing in…" : `Log in to ${role === "seller" ? "seller centre" : "rider hub"}`}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border bg-card p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Demo accounts (any password 4+ chars)</div>
            <div className="mt-3 space-y-2 max-h-56 overflow-y-auto no-scrollbar">
              {accounts.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => pick(a.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${selected === a.id ? "border-primary bg-primary-soft/40" : "hover:border-primary"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold truncate">{"store" in a ? a.store : a.name}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">{statusLabel[a.status]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{a.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-1 text-center text-sm">
            <div>
              <Link to={c.other.to} className="font-semibold text-primary">{c.other.label}</Link>
            </div>
            <div className="text-muted-foreground">
              Shopping instead? <Link to="/login" className="font-semibold text-primary">Customer login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
