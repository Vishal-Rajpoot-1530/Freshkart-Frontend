import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Home, Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/addresses")({
  head: () => ({ meta: [{ title: "Addresses — FreshKart" }] }),
  component: AddressesPage,
});

const initial = [
  { id: "a1", type: "Home", icon: Home, line: "203, Green Park Apartments, HSR Layout, Bengaluru 560102", phone: "+91 98765 43210", default: true },
  { id: "a2", type: "Work", icon: Briefcase, line: "Level 5, Prestige Tech Park, Marathahalli, Bengaluru 560037", phone: "+91 98765 43210", default: false },
];

function AddressesPage() {
  const [list, setList] = useState(initial);
  const setDefault = (id: string) => setList((l) => l.map((a) => ({ ...a, default: a.id === id })));
  const remove = (id: string) => setList((l) => l.filter((a) => a.id !== id));

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <h1 className="font-display text-3xl font-black">Saved addresses</h1>
        <div className="mt-6 space-y-3">
          {list.map((a) => {
            const I = a.icon;
            return (
              <div key={a.id} className="rounded-2xl border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary shrink-0"><I className="size-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{a.type}</span>
                      {a.default && <span className="rounded-md bg-primary-soft text-primary px-1.5 py-0.5 text-[10px] font-bold">DEFAULT</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{a.line}</p>
                    <p className="text-xs text-muted-foreground">{a.phone}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!a.default && <button onClick={() => setDefault(a.id)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">Set default</button>}
                  <button className="rounded-lg border px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1"><Pencil className="size-3" /> Edit</button>
                  <button onClick={() => remove(a.id)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-discount inline-flex items-center gap-1"><Trash2 className="size-3" /> Delete</button>
                </div>
              </div>
            );
          })}
          <button className="w-full rounded-2xl border-2 border-dashed p-6 text-sm font-semibold text-primary inline-flex items-center justify-center gap-2 hover:bg-primary-soft transition-colors">
            <Plus className="size-4" /> Add new address
          </button>
        </div>

        <div className="mt-8 rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-2 font-semibold mb-3"><MapPin className="size-4 text-primary" /> Add address</div>
          <form className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Full name" className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="Phone number" className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="Flat / House no" className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="Area / Locality" className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="City" className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="Pincode" className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            <button type="button" className="sm:col-span-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">Save address</button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
