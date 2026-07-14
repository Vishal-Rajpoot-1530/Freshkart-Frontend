import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/order-success")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({ meta: [{ title: "Order placed — FreshKart" }] }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { id = "FK000000" } = Route.useSearch();
  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto grid size-24 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift">
          <CheckCircle2 className="size-12" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-black">Order confirmed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your groceries are on the way. Track live progress below.</p>
        <div className="mt-6 rounded-2xl border bg-card p-5 shadow-soft text-left">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-bold">{id}</span></div>
          <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Estimated delivery</span><span className="font-semibold text-primary">8-12 minutes</span></div>
          <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Delivery partner</span><span className="font-semibold">Rahul K.</span></div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to="/order/$id" params={{ id }} className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">Track order</Link>
          <Link to="/" className="flex-1 rounded-xl border-2 py-3 text-sm font-bold">Continue shopping</Link>
        </div>
      </div>
    </AppLayout>
  );
}
