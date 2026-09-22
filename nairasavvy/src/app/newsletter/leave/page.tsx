import type { Metadata } from "next";
import { tokenSchema } from "@/lib/newsletter";
export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const parsed = tokenSchema.safeParse(token);
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="container-content"
      style={{ paddingTop: 140, paddingBottom: 100 }}
    >
      <h1 className="type-h1">Leave the Naira Shield</h1>
      {parsed.success ? (
        <form
          method="post"
          action={`/api/newsletter/leave?token=${parsed.data}`}
        >
          <p>Stop receiving NairaSavvy newsletters.</p>
          <button className="btn-primary">Unsubscribe</button>
        </form>
      ) : (
        <p>
          This link is invalid. Use the unsubscribe link in your newsletter.
        </p>
      )}
    </main>
  );
}
