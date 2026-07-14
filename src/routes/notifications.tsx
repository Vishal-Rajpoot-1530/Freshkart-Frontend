import { createFileRoute } from "@tanstack/react-router";
import { Tag, Package, Bell } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — FreshKart" }] }),
  component: NotificationsPage,
});

const notifications = [
  { icon: Tag, color: "text-offer bg-offer/15", title: "40% off your next order", desc: "Use code FRESH40 at checkout. Expires tonight!", time: "2m ago", tag: "Offer" },
  { icon: Package, color: "text-primary bg-primary-soft", title: "Order FK782341 out for delivery", desc: "Rahul is on the way. ETA 6 minutes.", time: "12m ago", tag: "Order" },
  { icon: Bell, color: "text-muted-foreground bg-muted", title: "Weekly meal plan is live", desc: "Fresh recipes and shopping list ready.", time: "1h ago", tag: "System" },
  { icon: Tag, color: "text-offer bg-offer/15", title: "Weekend bonanza", desc: "Up to 60% off across snacks and beverages.", time: "3h ago", tag: "Offer" },
  { icon: Package, color: "text-primary bg-primary-soft", title: "Order FK781992 delivered", desc: "Rate your experience for FreshKart credits.", time: "Yesterday", tag: "Order" },
];

function NotificationsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <h1 className="font-display text-3xl font-black">Notifications</h1>
        <div className="mt-6 space-y-3">
          {notifications.map((n, i) => {
            const I = n.icon;
            return (
              <div key={i} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-soft">
                <div className={`grid size-11 place-items-center rounded-xl shrink-0 ${n.color}`}><I className="size-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{n.title}</span>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">{n.tag}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.desc}</p>
                  <div className="text-xs text-muted-foreground mt-1">{n.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
