import { Link } from "@tanstack/react-router";
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

const items = [
  { to: "/" as const, label: "Home", icon: Home },
  { to: "/search" as const, label: "Search", icon: Search },
  { to: "/cart" as const, label: "Cart", icon: ShoppingCart, badge: true },
  { to: "/wishlist" as const, label: "Wishlist", icon: Heart },
  { to: "/profile" as const, label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const { cartCount, state } = useApp();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t safe-bottom">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const badge = it.to === "/cart" ? cartCount : it.to === "/wishlist" ? state.wishlist.length : 0;
          return (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.to === "/" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
            >
              <div className="relative">
                <Icon className="size-5" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 grid min-w-4 h-4 px-1 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {badge}
                  </span>
                )}
              </div>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
