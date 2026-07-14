import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Lock, Gift } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, AuthField } from "./login";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a 10-digit phone number"),
  password: z.string().min(6, "At least 6 characters"),
  confirm: z.string(),
  referral: z.string().optional(),
  terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
}).refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — FreshKart" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  const router = useRouter();

  const onSubmit = async (v: Values) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Account created — check your phone for OTP");
    router.navigate({ to: "/otp", search: { phone: v.phone } });
  };

  return <AuthShell right="register"><div>
    <h1 className="font-display text-3xl font-black">Create your account</h1>
    <p className="text-sm text-muted-foreground">Fresh groceries in minutes. Free to join.</p>
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <AuthField label="Full name" icon={User} error={errors.name?.message}>
        <input {...register("name")} className="auth-input" placeholder="Aarav Sharma" />
      </AuthField>
      <AuthField label="Email" icon={Mail} error={errors.email?.message}>
        <input {...register("email")} type="email" className="auth-input" placeholder="you@example.com" />
      </AuthField>
      <AuthField label="Phone" icon={Phone} error={errors.phone?.message}>
        <input {...register("phone")} className="auth-input" placeholder="9876543210" />
      </AuthField>
      <div className="grid sm:grid-cols-2 gap-4">
        <AuthField label="Password" icon={Lock} error={errors.password?.message}>
          <input {...register("password")} type="password" className="auth-input" placeholder="••••••••" />
        </AuthField>
        <AuthField label="Confirm" icon={Lock} error={errors.confirm?.message}>
          <input {...register("confirm")} type="password" className="auth-input" placeholder="••••••••" />
        </AuthField>
      </div>
      <AuthField label="Referral code (optional)" icon={Gift}>
        <input {...register("referral")} className="auth-input" placeholder="FRESH150" />
      </AuthField>
      <label className="flex items-start gap-2 text-sm">
        <input {...register("terms")} type="checkbox" className="mt-0.5 accent-primary size-4" />
        <span>I agree to the <a href="#" className="text-primary font-semibold">Terms</a> and <a href="#" className="text-primary font-semibold">Privacy Policy</a></span>
      </label>
      {errors.terms && <div className="text-xs text-discount">{errors.terms.message}</div>}
      <button disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lift disabled:opacity-60">
        {isSubmitting ? "Creating..." : "Create account"}
      </button>
    </form>
    <div className="mt-6 text-center text-sm">Already have an account? <Link to="/login" className="text-primary font-semibold">Log in</Link></div>
  </div></AuthShell>;
}
