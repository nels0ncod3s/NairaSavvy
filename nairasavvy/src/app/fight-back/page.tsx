import type { Metadata } from "next";
import CategoryLanding from "@/components/CategoryLanding";

export const metadata: Metadata = {
  title: "Fight Back Against Banks and Bad Systems",
  description:
    "Know your rights as a Nigerian bank customer. Templates, guides, and tools to resolve disputes, file CBN complaints, and hold banks accountable.",
  alternates: { canonical: "/fight-back" },
  openGraph: {
    title: "Fight Back Against Banks and Bad Systems | NairaSavvy",
    description:
      "Know your rights. Use them. CBN complaints, failed transaction disputes, and consumer protection in plain English.",
    url: "/fight-back",
  },
};

export default function Page() {
  return (
    <CategoryLanding
      category="fight-back"
      label="Fight Back"
      title="Find your voice."
      accent="Put it in writing."
      description="Failed transfers, unexpected charges or an unresolved complaint? Get organised and take a clear next step."
      symbol="!"
      steps={[
        {
          title: "Keep the evidence.",
          text: "Save your transaction reference, date, amount and relevant messages. Keep sensitive account information private.",
        },
        {
          title: "Start with your bank.",
          text: "Explain the issue, request a resolution and retain the complaint reference so you can follow up.",
        },
        {
          title: "Know the next step.",
          text: "If the issue remains unresolved, check the CBN complaint procedure. Escalation requirements depend on the issue.",
        },
      ]}
      tool={{
        title: "A clear complaint starts here.",
        text: "Turn the details into an editable letter. Review, copy or download it directly in your browser.",
        href: "/tools/complaint-letter",
        cta: "Build your complaint letter",
      }}
    />
  );
}
