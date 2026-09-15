import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
export default function NewsletterClient() {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero">
          <div className="container-content" style={{ maxWidth: 680 }}>
            <span className="category-tag">Free email updates</span>
            <h1 className="type-h1">The Naira Shield</h1>
            <p>
              Savings comparisons, practical guides and consumer updates.
              Confirm your email to join.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
