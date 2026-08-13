import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { usePartnerAuth } from "@/context/PartnerAuthContext";

export const Route = createFileRoute("/rider")({
  component: RiderLayout,
});

function RiderLayout() {
  const { session, hydrated } = usePartnerAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname.startsWith("/rider/login");

  if (isLogin) return <Outlet />;
  if (!hydrated) return <div className="min-h-dvh bg-surface" />;
  if (!session || session.role !== "rider") {
    return (
      <div className="min-h-dvh grid place-items-center bg-surface p-6">
        <div className="max-w-sm rounded-2xl border bg-card p-6 text-center shadow-soft">
          <div className="text-5xl">🛵</div>
          <h1 className="mt-3 font-display text-2xl font-black">Rider sign-in required</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in with your rider partner account to open the Rider Hub.</p>
          <Link to="/rider/login" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            Go to rider login
          </Link>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
