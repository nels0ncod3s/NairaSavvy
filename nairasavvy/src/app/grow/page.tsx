import type { Metadata } from "next";
import CategoryLanding from "@/components/CategoryLanding";

export const metadata: Metadata = {
  title: "Grow What You Have",
  description:
    "T-bills, dollar accounts, mutual funds, and more, explained in plain English with real numbers for everyday Nigerians.",
  alternates: { canonical: "/grow" },
  openGraph: {
    title: "Grow What You Have | NairaSavvy",
    description:
      "Every naira you're not growing is shrinking. Practical investment options for Nigerians, no jargon.",
    url: "/grow",
  },
};

export default function Page() {
  return (
    <CategoryLanding
      category="grow"
      label="Grow"
      title="Think beyond"
      accent="the headline return."
      description="Put your goals first. Understand the products, the trade-offs and what it means to make your money work harder."
      symbol="↗"
      steps={[
        {
          title: "Give your money a job.",
          text: "An emergency fund and a five-year goal need different things. Decide when you’ll need the money before choosing a product.",
        },
        {
          title: "Read beyond the rate.",
          text: "Look at fees, access rules and the possibility of loss. A higher quoted yield does not make a product safer.",
        },
        {
          title: "Keep currency in view.",
          text: "Compare like with like. A dollar return and a naira return carry different exchange-rate exposure.",
        },
      ]}
      tool={{
        title: "Put savings options side by side.",
        text: "Compare currencies, published yields, product terms and source dates in one place.",
        href: "/savings",
        cta: "Explore NairaGuard",
      }}
    />
  );
}
