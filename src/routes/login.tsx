import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — FreshKart" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);
  const router = useRouter();

  const onSubmit = async (_v: Values) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Welcome back!");
    router.navigate({ to: "/" });
  };

  return <AuthShell right="login"><div>
    <h1 className="font-display text-3xl font-black">Welcome back</h1>
    <p className="text-sm text-muted-foreground">Log in to continue shopping fresh.</p>
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <AuthField label="Email" icon={Mail} error={errors.email?.message}>
        <input {...register("email")} type="email" placeholder="you@example.com" className="auth-input" />
      </AuthField>
      <AuthField label="Password" icon={Lock} error={errors.password?.message}>
        <input {...register("password")} type={show ? "text" : "password"} placeholder="••••••••" className="auth-input pr-10" />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </AuthField>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("remember")} className="accent-primary size-4" /> Remember me
        </label>
        <a href="#" className="text-primary font-semibold">Forgot password?</a>
      </div>
      <button disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lift disabled:opacity-60">
        {isSubmitting ? "Signing in..." : "Log in"}
      </button>
    </form>
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" /></div>
    <button type="button" onClick={() => toast.info("Google login demo")} className="w-full rounded-xl border-2 bg-card py-3 text-sm font-semibold inline-flex items-center justify-center gap-3 hover:border-primary">
      <GoogleIcon /> Continue with Google
    </button>
    <div className="mt-6 text-center text-sm">New to FreshKart? <Link to="/register" className="text-primary font-semibold">Create account</Link></div>
  </div></AuthShell>;
}

export function AuthShell({ children, right }: { children: React.ReactNode; right: "login" | "register" | "otp" }) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary via-emerald-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="grid size-10 place-items-center rounded-xl bg-white text-primary font-black">F</div>
          <div className="font-display text-xl font-black">FreshKart</div>
        </Link>
        <div className="relative">
          <div className="text-6xl">{right === "otp" ? "🔐" : right === "register" ? "🎉" : "🥬"}</div>
          <h2 className="mt-4 font-display text-3xl font-black leading-tight">Groceries in 10 minutes,<br />seven days a week.</h2>
          <p className="mt-3 text-white/80 max-w-md">Join 2M+ households across India already saving hours every week with FreshKart.</p>
        </div>
        <div className="text-xs text-white/70 relative">© {new Date().getFullYear()} FreshKart Retail Pvt Ltd</div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-black">F</div>
            <div className="font-display font-black">FreshKart</div>
          </Link>
          {children}
        </div>
      </div>
      <style>{`.auth-input{width:100%;border:1px solid var(--color-border);background:var(--color-background);border-radius:12px;padding:11px 12px 11px 40px;font-size:14px;outline:none;transition:border-color .15s}.auth-input:focus{border-color:var(--color-primary)}`}</style>
    </div>
  );
}

export function AuthField({ label, icon: Icon, error, children }: { label: string; icon?: React.ComponentType<{ className?: string }>; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold mb-1.5">{label}</div>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />}
        {children}
      </div>
      {error && <div className="mt-1 text-xs text-discount">{error}</div>}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
  );
}
