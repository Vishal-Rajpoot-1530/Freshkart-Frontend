import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type PartnerRole = "seller" | "rider";

export type PartnerSession = {
  role: PartnerRole;
  partnerId: string;
  name: string;
  email: string;
};

const STORAGE_KEY = "freshkart-partner-session-v1";

type Ctx = {
  session: PartnerSession | null;
  hydrated: boolean;
  signIn: (s: PartnerSession) => void;
  signOut: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);

export function PartnerAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PartnerSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as PartnerSession);
    } catch {}
    setHydrated(true);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      session,
      hydrated,
      signIn: (s) => {
        setSession(s);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        } catch {}
      },
      signOut: () => {
        setSession(null);
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {}
      },
    }),
    [session, hydrated],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function usePartnerAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("usePartnerAuth must be used inside PartnerAuthProvider");
  return ctx;
}
