import NewsletterForm from "./NewsletterForm";
export default function NewsletterCTA() {
  return (
    <section className="newsletter-section">
      <div className="container-content newsletter-layout">
        <div>
          <p className="eyebrow">THE NAIRA SHIELD / IN YOUR INBOX</p>
          <h2>
            A little wiser.
            <br />
            <em>Every time you open.</em>
          </h2>
          <p>
            Money insights worth making room for. Practical guides, comparisons
            and consumer updates.
          </p>
        </div>
        <div className="newsletter-signup">
          <span className="newsletter-spark" aria-hidden="true">
            ✳
          </span>
          <h3>Your next smart move starts here.</h3>
          <NewsletterForm />
          <p className="newsletter-promise">
            Free to join. Unsubscribe whenever you like.
          </p>
        </div>
      </div>
    </section>
  );
}
