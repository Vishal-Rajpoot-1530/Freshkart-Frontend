import { createFileRoute } from "@tanstack/react-router";
import { PartnerLoginForm } from "@/components/console/PartnerLoginForm";

export const Route = createFileRoute("/seller/login")({
  head: () => ({
    meta: [
      { title: "Seller login — FreshKart Seller Centre" },
      { name: "description", content: "Log in to FreshKart Seller Centre to manage your store catalogue, incoming orders, payouts and performance." },
      { property: "og:title", content: "Seller login — FreshKart Seller Centre" },
      { property: "og:description", content: "Partner store sign-in for catalogue, orders and payout management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PartnerLoginForm role="seller" />,
});
