import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { tokenSchema } from "@/lib/newsletter";
export const metadata: Metadata = {
  title: "Confirm subscription",
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
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero">
          <div className="container-content" style={{ maxWidth: 680 }}>
            <h1 className="type-h1">Confirm your subscription</h1>
            {success ? (
              <p role="status">Your subscription is confirmed.</p>
            ) : params.result === "unavailable" ? (
              <p role="alert">
                This service is temporarily unavailable. Please reopen the link
                from your email and try again later.
              </p>
            ) : !valid.success || params.result === "invalid" ? (
              <p role="alert">
                This link is invalid or expired. Request a new confirmation on
                the newsletter page.
              </p>
            ) : (
              <form method="post" action="/api/newsletter/confirm">
                <input type="hidden" name="token" value={valid.data} />
                <p>Confirm that you requested email updates from NairaSavvy.</p>
                <button className="btn-primary">Confirm subscription</button>
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
