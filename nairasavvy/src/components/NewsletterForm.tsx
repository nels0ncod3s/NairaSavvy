"use client";
import { useId, useState } from "react";
import { usePathname } from "next/navigation";
export default function NewsletterForm() {
  const id = useId();
  const source = usePathname();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setMessage("");
    setError(false);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"),
          source,
        }),
      });
      const body = await res.json();
      setMessage(body.error || body.message || "Please try again.");
      setError(!res.ok);
      if (res.ok) form.reset();
    } catch {
      setError(true);
      setMessage("Unable to connect. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <div>
      <form
        method="post"
        action="/api/subscribe"
        onSubmit={submit}
        className="newsletter-form"
      >
        <label htmlFor={id}>Email address</label>
        <div className="newsletter-fields">
          <input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            className="input"
            required
            maxLength={254}
            placeholder="you@example.com"
          />
          <button className="btn-primary" disabled={pending}>
            {pending ? "Submitting…" : "Get Free Alerts"}
          </button>
        </div>
        <div hidden>
          <label>
            Leave blank
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </form>
      <p className="type-small">
        By subscribing, you agree to receive NairaSavvy emails.{" "}
        <a href="/privacy">Privacy policy</a>. Unsubscribe using the link in
        your email.
      </p>
      <p role={error ? "alert" : "status"} aria-live="polite">
        {message}
      </p>
    </div>
  );
}
