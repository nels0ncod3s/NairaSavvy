import type { Metadata } from "next";
import CategoryLanding from "@/components/CategoryLanding";

export const metadata: Metadata = {
  title: "Cut the Hidden Costs",
  description:
    "Find and eliminate hidden bank charges, data billing errors, overpriced insurance, and the everyday costs most Nigerians don't notice.",
  alternates: { canonical: "/cut-costs" },
  openGraph: {
    title: "Cut the Hidden Costs | NairaSavvy",
    description: "You're paying more than you should. Here's where to stop.",
    url: "/cut-costs",
  },
};

export default function Page() {
  return (
    <CategoryLanding
      category="cut-costs"
      label="Cut Costs"
      title="The little things"
      accent="add up."
      description="Get more intentional about everyday spending. Start with the plans, subscriptions and charges you might be overlooking."
      symbol="✳"
      steps={[
        {
          title: "Follow the small charges.",
          text: "Review your statements and recurring subscriptions. A small payment is still worth understanding.",
        },
        {
          title: "Buy for your real life.",
          text: "Choose data that matches when and how you use it. A large bonus isn’t useful if you can’t use it.",
        },
        {
          title: "Check the fine print.",
          text: "Compare validity, eligibility and renewal terms before choosing a plan. Verify offers with the provider.",
        },
      ]}
      tool={{
        title: "More useful data for your naira.",
        text: "Filter by network, budget and validity. Compare ordinary data separately from restricted bonuses.",
        href: "/cut-costs/data-plans",
        cta: "Find a plan that fits",
      }}
    />
  );
}
