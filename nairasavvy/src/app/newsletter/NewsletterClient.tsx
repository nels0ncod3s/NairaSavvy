import { Check, Mail } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
export default function NewsletterClient() {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1} className="signup-page">
        <div className="container-content signup-grid">
          <div className="signup-copy">
            <p className="eyebrow">THE NAIRA SHIELD / FREE EMAIL UPDATES</p>
            <h1>
              Your inbox.
              <br />
              <em>A little savvier.</em>
            </h1>
            <p>
              Make room for information that helps you make sense of your money.
            </p>
            <ul>
              {[
                "Savings comparisons with the details that matter",
                "Practical guides you can put to work",
                "Consumer updates that help you ask better questions",
              ].map((text) => (
                <li key={text}>
                  <Check size={17} />
                  {text}
                </li>
              ))}
            </ul>
            <span className="signup-art" aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="signup-box">
            <span className="signup-icon">
              <Mail size={26} />
            </span>
            <p className="eyebrow">GOOD INFORMATION. STRAIGHT TO YOU.</p>
            <h2>Get the Naira Shield.</h2>
            <p>Enter your email, then confirm it using the link we send you.</p>
            <NewsletterForm />
            <div className="signup-note">
              No payment details. No account to manage.
              <br />
              Unsubscribe whenever you like.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
