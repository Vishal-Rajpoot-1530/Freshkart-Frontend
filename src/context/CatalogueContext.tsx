import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "@/data/products";

export type CatalogueItem = {
  id: string;
  name: string;
  category: string;
  brand: string;
  weight: string;
  price: number;
  mrp: number;
  stock: number;
  emoji: string;
  addedAt: string;
};

export type CatalogueDraft = Omit<CatalogueItem, "id" | "addedAt">;

const STORAGE_KEY = "freshkart-seller-catalogue-v1";

const seed: CatalogueItem[] = products.slice(20, 30).map((p, i) => ({
  id: `SKU-${4100 + i}`,
  name: p.name,
  category: p.category,
  brand: p.brand,
  weight: p.weight,
  price: p.price,
  mrp: p.originalPrice,
  stock: (i * 7) % 23,
  emoji: p.emoji,
  addedAt: new Date(Date.now() - (i + 2) * 86_400_000).toISOString().slice(0, 10),
}));

type Ctx = {
  items: CatalogueItem[];
  addItem: (draft: CatalogueDraft) => CatalogueItem;
  updateItem: (id: string, draft: CatalogueDraft) => void;
  removeItem: (id: string) => void;
  resetCatalogue: () => void;
};

const CatalogueCtx = createContext<Ctx | null>(null);

export function CatalogueProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CatalogueItem[]>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CatalogueItem[]);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<Ctx>(
    () => ({
      items,
      addItem: (draft) => {
        const item: CatalogueItem = {
          ...draft,
          id: `SKU-${Math.floor(5000 + Math.random() * 4000)}`,
          addedAt: new Date().toISOString().slice(0, 10),
        };
        setItems((list) => [item, ...list]);
        return item;
      },
      updateItem: (id, draft) => setItems((list) => list.map((it) => (it.id === id ? { ...it, ...draft } : it))),
      removeItem: (id) => setItems((list) => list.filter((it) => it.id !== id)),
      resetCatalogue: () => setItems(seed),
    }),
    [items],
  );

  return <CatalogueCtx.Provider value={value}>{children}</CatalogueCtx.Provider>;
}

export function useCatalogue() {
  const ctx = useContext(CatalogueCtx);
  if (!ctx) throw new Error("useCatalogue must be used inside CatalogueProvider");
  return ctx;
}
