import { createFileRoute } from "@tanstack/react-router";
import { PartnerLoginForm } from "@/components/console/PartnerLoginForm";

export const Route = createFileRoute("/rider/login")({
  head: () => ({
    meta: [
      { title: "Rider login — FreshKart Rider Hub" },
      { name: "description", content: "Log in to the FreshKart Rider Hub to go online, accept nearby pickups and track your daily earnings." },
      { property: "og:title", content: "Rider login — FreshKart Rider Hub" },
      { property: "og:description", content: "Delivery partner sign-in for trips, queue and earnings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PartnerLoginForm role="rider" />,
});
