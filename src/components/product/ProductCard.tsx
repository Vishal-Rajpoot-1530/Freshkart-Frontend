import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, Clock, Star } from "lucide-react";
import type { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { qty, add, inc, dec, toggleWish, isWished } = useApp();
  const quantity = qty(product.id);
  const wished = isWished(product.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-card p-3 shadow-soft hover:shadow-card transition-shadow",
        className
      )}
    >
      {product.discountPercent > 0 && (
        <span className="absolute top-2 left-2 z-10 rounded-md bg-discount px-1.5 py-0.5 text-[10px] font-bold text-discount-foreground">
          {product.discountPercent}% OFF
        </span>
      )}
      <button
        onClick={() => toggleWish(product.id)}
        className="absolute top-2 right-2 z-10 grid size-8 place-items-center rounded-full bg-background/80 backdrop-blur border hover:border-primary transition-colors"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("size-4 transition-all", wished ? "fill-discount text-discount scale-110" : "text-muted-foreground")} />
      </button>

      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block rounded-xl bg-surface overflow-hidden aspect-square"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Clock className="size-3 text-primary" />
        <span className="font-medium text-foreground">{product.deliveryMinutes} MINS</span>
      </div>

      <Link to="/product/$id" params={{ id: product.id }} className="mt-1 block">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
      </Link>

      <div className="text-xs text-muted-foreground mt-0.5">{product.weight}</div>

      <div className="mt-2 flex items-center gap-1 text-[11px]">
        <div className="flex items-center gap-0.5 rounded-md bg-primary-soft px-1.5 py-0.5 text-primary font-semibold">
          <Star className="size-3 fill-current" /> {product.rating.toFixed(1)}
        </div>
        <span className="text-muted-foreground">({product.reviews})</span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="font-bold">₹{product.price}</div>
          {product.originalPrice > product.price && (
            <div className="text-[11px] text-muted-foreground line-through">₹{product.originalPrice}</div>
          )}
        </div>

        {quantity === 0 ? (
          <button
            onClick={() => add(product.id)}
            disabled={!product.inStock}
            className="rounded-lg border-2 border-primary bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.inStock ? "ADD" : "OUT"}
          </button>
        ) : (
          <div className="flex items-center gap-0 rounded-lg overflow-hidden bg-primary text-primary-foreground">
            <button onClick={() => dec(product.id)} className="grid size-7 place-items-center hover:bg-primary/80" aria-label="decrease"><Minus className="size-3.5" /></button>
            <span className="w-6 text-center text-xs font-bold">{quantity}</span>
            <button onClick={() => inc(product.id)} className="grid size-7 place-items-center hover:bg-primary/80" aria-label="increase"><Plus className="size-3.5" /></button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
