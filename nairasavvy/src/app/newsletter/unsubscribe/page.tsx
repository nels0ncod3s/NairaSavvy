import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { tokenSchema } from "@/lib/newsletter";
export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; result?: string }>;
}) {
  const params = await searchParams;
  const valid = tokenSchema.safeParse(params.token);
  const success = params.result === "success";
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero">
          <div className="container-content" style={{ maxWidth: 680 }}>
            <h1 className="type-h1">Unsubscribe from the Naira Shield</h1>
            {success ? (
              <p role="status">
                Your subscription has been removed. You will not receive further
                newsletters.
              </p>
            ) : params.result === "unavailable" ? (
              <p role="alert">
                This service is temporarily unavailable. Please reopen the link
                from your email and try again later.
              </p>
            ) : !valid.success || params.result === "invalid" ? (
              <p role="alert">
                This link is invalid or expired. Use the unsubscribe link from
                your email.
              </p>
            ) : (
              <form method="post" action="/api/newsletter/unsubscribe">
                <input type="hidden" name="token" value={valid.data} />
                <p>Remove your email address from this subscription.</p>
                <button className="btn-primary">Unsubscribe</button>
              </form>
            )}
            <p>
              <a href="/newsletter">Newsletter page</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
