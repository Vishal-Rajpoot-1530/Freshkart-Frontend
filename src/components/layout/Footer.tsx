import { Link } from "@tanstack/react-router";
import { Apple, Smartphone, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <span className="text-lg font-black">F</span>
            </div>
            <div>
              <div className="font-display text-xl font-black">FreshKart</div>
              <div className="text-xs text-muted-foreground">Delivering groceries in minutes.</div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Handpicked essentials from local shelves to your doorstep in under 10 minutes. Fresher, faster, friendlier.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[Instagram, Twitter, Facebook, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="social" className="grid size-9 place-items-center rounded-lg border hover:border-primary hover:text-primary transition-colors">
                <I className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Company" links={[
          { to: "/about", label: "About us" },
          { to: "/contact", label: "Contact" },
          { to: "/help", label: "Careers" },
          { to: "/help", label: "Press" },
        ]} />
        <FooterCol title="Help" links={[
          { to: "/help", label: "Help center" },
          { to: "/orders", label: "Track order" },
          { to: "/help", label: "Refund policy" },
          { to: "/contact", label: "Report an issue" },
        ]} />
        <FooterCol title="Legal" links={[
          { to: "/help", label: "Terms of service" },
          { to: "/help", label: "Privacy policy" },
          { to: "/help", label: "Cookies" },
          { to: "/help", label: "Licenses" },
        ]} />
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} FreshKart Retail Pvt Ltd. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <a href="#" className="flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-xs font-semibold">
              <Apple className="size-4" /> App Store
            </a>
            <a href="#" className="flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-xs font-semibold">
              <Smartphone className="size-4" /> Google Play
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to as "/about"} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
