import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Add a short subject"),
  message: z.string().min(10, "Say a little more, please"),
});
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — FreshKart" }] }),
  component: ContactPage,
});

function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({ resolver: zodResolver(schema) });
  const onSubmit = (v: Values) => { toast.success(`Thanks ${v.name.split(" ")[0]}, we'll reply within 4 hours.`); reset(); };

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-4xl font-black">Get in touch</h1>
        <p className="text-muted-foreground mt-1">Questions, feedback, partnerships — we love hearing from you.</p>

        <div className="mt-8 grid lg:grid-cols-[1fr_420px] gap-8">
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden border shadow-soft aspect-[16/10] bg-gradient-to-br from-primary-soft to-emerald-100 grid place-items-center relative">
              <div className="text-center">
                <MapPin className="mx-auto size-10 text-primary" />
                <div className="mt-2 font-semibold">FreshKart HQ</div>
                <div className="text-sm text-muted-foreground">Prestige Tech Park, Bengaluru</div>
              </div>
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,white,transparent_60%),radial-gradient(circle_at_70%_60%,white,transparent_60%)]" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Info icon={Mail} label="Email" value="hello@freshkart.dev" />
              <Info icon={Phone} label="Phone" value="+91 80 4567 8900" />
              <Info icon={MapPin} label="Address" value="Bengaluru, India" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border bg-card p-6 shadow-soft space-y-4">
            <Field label="Name" error={errors.name?.message}>
              <input {...register("name")} className="input" placeholder="Your full name" />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" className="input" placeholder="you@example.com" />
            </Field>
            <Field label="Subject" error={errors.subject?.message}>
              <input {...register("subject")} className="input" placeholder="How can we help?" />
            </Field>
            <Field label="Message" error={errors.message?.message}>
              <textarea {...register("message")} rows={4} className="input" placeholder="Tell us more..." />
            </Field>
            <button type="submit" className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground inline-flex items-center justify-center gap-2"><Send className="size-4" /> Send message</button>
          </form>
        </div>
        <style>{`.input{width:100%;border:1px solid var(--color-border);background:var(--color-background);border-radius:12px;padding:10px 12px;font-size:14px;outline:none}.input:focus{border-color:var(--color-primary)}`}</style>
      </div>
    </AppLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold mb-1">{label}</div>
      {children}
      {error && <div className="mt-1 text-xs text-discount">{error}</div>}
    </label>
  );
}
function Info({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 flex items-start gap-3">
      <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary shrink-0"><Icon className="size-4" /></div>
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="text-sm font-semibold">{value}</div></div>
    </div>
  );
}
