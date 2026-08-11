import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { riders as riderSeed, sellers as sellerSeed, type PartnerStatus, type Rider, type Seller } from "@/data/partners";

type Overrides = { status: Record<string, PartnerStatus>; removed: string[] };

const STORAGE_KEY = "freshkart-partners-v1";
const empty: Overrides = { status: {}, removed: [] };

type Ctx = {
  sellers: Seller[];
  riders: Rider[];
  seller: (id: string) => Seller | undefined;
  rider: (id: string) => Rider | undefined;
  setStatus: (id: string, status: PartnerStatus) => void;
  removePartner: (id: string) => void;
  isRemoved: (id: string) => boolean;
  canAcceptOrders: (id: string) => boolean;
};

const PartnersCtx = createContext<Ctx | null>(null);

export function PartnersProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>(empty);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setOverrides({ ...empty, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides]);

  const value = useMemo<Ctx>(() => {
    const apply = <T extends { id: string; status: PartnerStatus }>(list: T[]): T[] =>
      list
        .filter((p) => !overrides.removed.includes(p.id))
        .map((p) => ({ ...p, status: overrides.status[p.id] ?? p.status }));

    const sellers = apply(sellerSeed);
    const riders = apply(riderSeed);
    const statusOf = (id: string) =>
      overrides.status[id] ?? [...sellerSeed, ...riderSeed].find((p) => p.id === id)?.status;

    return {
      sellers,
      riders,
      seller: (id) => sellers.find((s) => s.id === id),
      rider: (id) => riders.find((r) => r.id === id),
      setStatus: (id, status) =>
        setOverrides((o) => ({ ...o, status: { ...o.status, [id]: status } })),
      removePartner: (id) =>
        setOverrides((o) => ({ ...o, removed: o.removed.includes(id) ? o.removed : [...o.removed, id] })),
      isRemoved: (id) => overrides.removed.includes(id),
      canAcceptOrders: (id) => !overrides.removed.includes(id) && statusOf(id) === "verified",
    };
  }, [overrides]);

  return <PartnersCtx.Provider value={value}>{children}</PartnersCtx.Provider>;
}

export function usePartners() {
  const ctx = useContext(PartnersCtx);
  if (!ctx) throw new Error("usePartners must be used inside PartnersProvider");
  return ctx;
}
