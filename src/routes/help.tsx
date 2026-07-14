import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Send, Search, ChevronDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help center — FreshKart" }] }),
  component: HelpPage,
});

const faqs = [
  { q: "How fast is delivery?", a: "We deliver in under 10 minutes on most orders within our serviceable areas. Larger orders may take up to 20 minutes." },
  { q: "What is the minimum order?", a: "There's no minimum order value. Free delivery kicks in above ₹199." },
  { q: "Can I cancel an order?", a: "You can cancel within 60 seconds of placing the order, before our team starts packing." },
  { q: "How do refunds work?", a: "Refunds are processed instantly to your original payment method or as FreshKart credits." },
  { q: "Is my payment secure?", a: "We use bank-grade encryption and never store your card details on our servers." },
];

function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [chat, setChat] = useState<{ from: "me" | "bot"; text: string }[]>([
    { from: "bot", text: "Hi! I'm the FreshKart assistant. How can I help you today?" },
  ]);
  const [msg, setMsg] = useState("");

  const send = () => {
    if (!msg.trim()) return;
    setChat((c) => [...c, { from: "me", text: msg }]);
    setMsg("");
    setTimeout(() => setChat((c) => [...c, { from: "bot", text: "Got it — a human agent will join in under a minute." }]), 700);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <h1 className="font-display text-3xl font-black">How can we help?</h1>

        <label className="mt-4 flex items-center gap-2 rounded-2xl border bg-card px-4 py-3.5 focus-within:border-primary shadow-soft">
          <Search className="size-4 text-muted-foreground" />
          <input placeholder="Search help articles..." className="flex-1 bg-transparent outline-none text-sm" />
        </label>

        <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
          <div>
            <h2 className="font-display text-xl font-black mb-3">Frequently asked</h2>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <div key={i} className="rounded-2xl border bg-card shadow-soft overflow-hidden">
                  <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-4 text-left">
                    <span className="font-semibold text-sm">{f.q}</span>
                    <ChevronDown className={`size-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </button>
                  {open === i && <div className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border bg-card shadow-soft flex flex-col h-[540px]">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><MessageCircle className="size-4" /></div>
              <div>
                <div className="font-semibold text-sm">Live chat</div>
                <div className="text-xs text-primary">● Online · avg 2 min reply</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chat.map((c, i) => (
                <div key={i} className={`flex ${c.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${c.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{c.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t flex items-center gap-2">
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              <button type="submit" className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Send className="size-4" /></button>
            </form>
          </aside>
        </div>

        <div className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-black">Raise a ticket</h2>
          <p className="text-sm text-muted-foreground">Prefer email? Log an issue and we'll get back within 4 hours.</p>
          <form className="mt-4 grid gap-3 sm:grid-cols-2">
            <input placeholder="Order ID (optional)" className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <select className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
              <option>Delivery issue</option><option>Missing item</option><option>Payment</option><option>Other</option>
            </select>
            <textarea rows={3} placeholder="Describe the issue..." className="sm:col-span-2 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button type="button" className="sm:col-span-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">Submit ticket</button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
