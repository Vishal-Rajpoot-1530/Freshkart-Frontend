import { createFileRoute, Link } from "@tanstack/react-router";
import { User, MapPin, CreditCard, Bell, Globe, LogOut, ChevronRight, Package, Heart, HelpCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — FreshKart" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state, cartCount } = useApp();
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-white shadow-lift">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full bg-white/20 backdrop-blur text-2xl font-black">AS</div>
            <div>
              <div className="font-display text-xl font-black">Aarav Sharma</div>
              <div className="text-sm opacity-90">aarav@freshkart.dev · +91 98765 43210</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Orders" value="12" />
            <Stat label="Saved" value={state.wishlist.length.toString()} />
            <Stat label="Cart" value={cartCount.toString()} />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Row to="/orders" icon={Package} label="My orders" desc="Track & reorder" />
          <Row to="/wishlist" icon={Heart} label="Wishlist" desc={`${state.wishlist.length} items`} />
          <Row to="/addresses" icon={MapPin} label="Saved addresses" desc="Home, Work + more" />
          <Row to="/profile" icon={CreditCard} label="Payment methods" desc="UPI, cards, wallets" />
          <Row to="/notifications" icon={Bell} label="Notifications" desc="Offers & updates" />
          <Row to="/profile" icon={Globe} label="Language" desc="English (India)" />
          <Row to="/help" icon={HelpCircle} label="Help center" desc="FAQs & support" />
          <Row to="/" icon={LogOut} label="Log out" desc="Sign out of account" />
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur p-3 text-center">
      <div className="font-display text-2xl font-black">{value}</div>
      <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}

function Row({ to, icon: Icon, label, desc }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; desc: string }) {
  return (
    <Link to={to as "/orders"} className="flex items-center gap-3 rounded-2xl border bg-card p-4 hover:border-primary transition-colors">
      <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary shrink-0"><Icon className="size-5" /></div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}
