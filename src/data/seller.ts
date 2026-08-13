import { categories } from "./categories";
import { products } from "./products";

export type SellerOrder = {
  id: string;
  date: string; // ISO date
  customer: string;
  items: { name: string; qty: number; price: number; emoji: string; category: string }[];
  total: number;
  status: "Delivered" | "Cancelled" | "Packing" | "Ready" | "New" | "Handed over";
  slot: string;
  category: string;
  reason?: string;
};

export type SellerReview = {
  id: string;
  customer: string;
  rating: number;
  date: string;
  product: string;
  category: string;
  comment: string;
};

export const sellerCategories = categories.slice(0, 8).map((c) => c.name);

const pool = products.slice(0, 40);
const names = [
  "Aarav Sharma", "Diya Patel", "Kabir Iyer", "Meera Nair", "Rohan Das", "Ishita Roy",
  "Vivaan Kulkarni", "Ananya Bose", "Arjun Mehta", "Saanvi Pillai", "Neel Kapoor", "Tara Joshi",
];

function isoDaysAgo(d: number) {
  const dt = new Date(Date.now() - d * 86_400_000);
  return dt.toISOString().slice(0, 10);
}

export const sellerOrders: SellerOrder[] = Array.from({ length: 48 }, (_, i) => {
  const p1 = pool[(i * 5) % pool.length];
  const p2 = pool[(i * 11 + 3) % pool.length];
  const qty1 = (i % 3) + 1;
  const qty2 = (i % 2) + 1;
  const total = p1.price * qty1 + p2.price * qty2;
  const status: SellerOrder["status"] =
    i % 17 === 0 ? "Cancelled" : i < 4 ? (["New", "Packing", "Ready", "Handed over"] as const)[i] : "Delivered";
  return {
    id: `FK7823${(90 - i).toString().padStart(2, "0")}`,
    date: isoDaysAgo(Math.floor(i / 6)),
    customer: names[i % names.length],
    items: [
      { name: p1.name, qty: qty1, price: p1.price, emoji: p1.emoji, category: p1.category },
      { name: p2.name, qty: qty2, price: p2.price, emoji: p2.emoji, category: p2.category },
    ],
    total,
    status,
    slot: `${8 + (i % 12)}:${i % 2 ? "30" : "00"} ${i % 12 > 3 ? "PM" : "AM"}`,
    category: p1.category,
    reason: status === "Cancelled" ? ["Out of stock", "Customer cancelled", "Rider unavailable", "Payment failed"][i % 4] : undefined,
  };
});

export const sellerReviews: SellerReview[] = Array.from({ length: 26 }, (_, i) => {
  const p = pool[(i * 7) % pool.length];
  const rating = [5, 5, 4, 5, 3, 4, 5, 2, 4, 5][i % 10];
  return {
    id: `RV-${3100 + i}`,
    customer: names[(i + 3) % names.length],
    rating,
    date: isoDaysAgo(i),
    product: p.name,
    category: p.category,
    comment:
      rating >= 5
        ? "Super fresh and delivered way before time. Packaging was neat."
        : rating === 4
          ? "Good quality overall, delivery was slightly delayed."
          : rating === 3
            ? "Average produce this time, some items were not fresh enough."
            : "Item was damaged on arrival, had to request a replacement.",
  };
});

export const salesWeek = [
  { label: "Mon", value: 12400, orders: 128, target: 15000 },
  { label: "Tue", value: 15200, orders: 141, target: 15000 },
  { label: "Wed", value: 17800, orders: 163, target: 15000 },
  { label: "Thu", value: 14100, orders: 132, target: 15000 },
  { label: "Fri", value: 21600, orders: 197, target: 15000 },
  { label: "Sat", value: 26800, orders: 233, target: 15000 },
  { label: "Sun", value: 23100, orders: 208, target: 15000 },
];

export const salesTargetWeek = 140_000;
