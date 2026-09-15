import NewsletterForm from "./NewsletterForm";
export default function NewsletterCTA() {
  return (
    <section className="ns-section-dark newsletter-section">
      <div className="container-content" style={{ maxWidth: 680 }}>
        <p className="type-label">The Naira Shield</p>
        <h2 className="type-h2">
          Make your next money decision with better information.
        </h2>
        <p>
          Practical guides, rate comparisons and consumer updates, delivered by
          email.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}
