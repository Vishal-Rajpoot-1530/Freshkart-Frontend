import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { products } from "@/data/products";
import type { CartItem } from "@/types";

type State = {
  cart: CartItem[];
  wishlist: string[];
  location: string;
  recentlyViewed: string[];
};

type Action =
  | { type: "ADD"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "INC"; id: string }
  | { type: "DEC"; id: string }
  | { type: "CLEAR" }
  | { type: "TOGGLE_WISH"; id: string }
  | { type: "SET_LOCATION"; loc: string }
  | { type: "VIEW"; id: string }
  | { type: "HYDRATE"; state: State };

const initial: State = {
  cart: [],
  wishlist: [],
  location: "HSR Layout, Bengaluru",
  recentlyViewed: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE": return action.state;
    case "ADD": {
      const existing = state.cart.find((i) => i.productId === action.id);
      if (existing) return { ...state, cart: state.cart.map((i) => i.productId === action.id ? { ...i, quantity: i.quantity + 1 } : i) };
      return { ...state, cart: [...state.cart, { productId: action.id, quantity: 1 }] };
    }
    case "INC":
      return { ...state, cart: state.cart.map((i) => i.productId === action.id ? { ...i, quantity: i.quantity + 1 } : i) };
    case "DEC": {
      const item = state.cart.find((i) => i.productId === action.id);
      if (item && item.quantity <= 1) return { ...state, cart: state.cart.filter((i) => i.productId !== action.id) };
      return { ...state, cart: state.cart.map((i) => i.productId === action.id ? { ...i, quantity: i.quantity - 1 } : i) };
    }
    case "REMOVE":
      return { ...state, cart: state.cart.filter((i) => i.productId !== action.id) };
    case "CLEAR": return { ...state, cart: [] };
    case "TOGGLE_WISH":
      return { ...state, wishlist: state.wishlist.includes(action.id) ? state.wishlist.filter((x) => x !== action.id) : [...state.wishlist, action.id] };
    case "SET_LOCATION": return { ...state, location: action.loc };
    case "VIEW":
      return { ...state, recentlyViewed: [action.id, ...state.recentlyViewed.filter((x) => x !== action.id)].slice(0, 12) };
    default: return state;
  }
}

type Ctx = {
  state: State;
  add: (id: string) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  qty: (id: string) => number;
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
  setLocation: (loc: string) => void;
  view: (id: string) => void;
  cartCount: number;
  cartTotal: { subtotal: number; savings: number; delivery: number; tax: number; total: number };
};

const AppCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "freshkart-state-v1";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: { ...initial, ...JSON.parse(raw) } });
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<Ctx>(() => {
    const cartCount = state.cart.reduce((n, i) => n + i.quantity, 0);
    let subtotal = 0;
    let savings = 0;
    for (const item of state.cart) {
      const p = products.find((pr) => pr.id === item.productId);
      if (!p) continue;
      subtotal += p.price * item.quantity;
      savings += (p.originalPrice - p.price) * item.quantity;
    }
    const delivery = subtotal === 0 || subtotal >= 199 ? 0 : 25;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + delivery + tax;

    return {
      state,
      add: (id) => dispatch({ type: "ADD", id }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      inc: (id) => dispatch({ type: "INC", id }),
      dec: (id) => dispatch({ type: "DEC", id }),
      clear: () => dispatch({ type: "CLEAR" }),
      qty: (id) => state.cart.find((i) => i.productId === id)?.quantity ?? 0,
      toggleWish: (id) => dispatch({ type: "TOGGLE_WISH", id }),
      isWished: (id) => state.wishlist.includes(id),
      setLocation: (loc) => dispatch({ type: "SET_LOCATION", loc }),
      view: (id) => dispatch({ type: "VIEW", id }),
      cartCount,
      cartTotal: { subtotal, savings, delivery, tax, total },
    };
  }, [state]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
