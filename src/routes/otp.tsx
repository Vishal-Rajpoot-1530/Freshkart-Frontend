import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "./login";

export const Route = createFileRoute("/otp")({
  validateSearch: z.object({ phone: z.string().optional() }),
  head: () => ({ meta: [{ title: "Verify OTP — FreshKart" }] }),
  component: OtpPage,
});

function OtpPage() {
  const { phone = "9876543210" } = Route.useSearch();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const set = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setDigits((d) => { const n = [...d]; n[i] = digit; return n; });
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = async () => {
    if (digits.some((d) => !d)) return toast.error("Enter the 6-digit code");
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Verified — welcome to FreshKart!");
    router.navigate({ to: "/" });
  };

  return <AuthShell right="otp"><div>
    <h1 className="font-display text-3xl font-black">Verify your number</h1>
    <p className="text-sm text-muted-foreground mt-1">We sent a 6-digit code to <span className="font-semibold text-foreground">+91 {phone}</span></p>
    <div className="mt-8 flex justify-between gap-2 sm:gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          value={d}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-xl border-2 bg-card outline-none focus:border-primary transition-colors"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
    <button onClick={verify} disabled={verifying} className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lift disabled:opacity-60">
      {verifying ? "Verifying..." : "Verify & continue"}
    </button>
    <div className="mt-6 text-center text-sm text-muted-foreground">
      Didn't receive the code?{" "}
      {seconds > 0 ? (
        <span>Resend in <span className="font-semibold text-foreground">0:{seconds.toString().padStart(2, "0")}</span></span>
      ) : (
        <button onClick={() => { setSeconds(30); toast.success("OTP resent"); }} className="text-primary font-semibold">Resend OTP</button>
      )}
    </div>
  </div></AuthShell>;
}
