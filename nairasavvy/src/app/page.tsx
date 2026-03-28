import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8", minHeight: "60vh" }}>
        {/* Phase 2: Homepage sections assembled here */}
        <div
          id="hero-sentinel"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "120px 24px",
            textAlign: "center",
          }}
        >
          <h1 className="type-display" style={{ color: "#1A1A1A", marginBottom: "24px" }}>
            Nigeria&apos;s financial system
            <br />
            wasn&apos;t built for you.
            <br />
            <span style={{ color: "#1B5E3B" }}>NairaSavvy was.</span>
          </h1>
          <p
            className="type-body"
            style={{ color: "#6B6560", maxWidth: "560px", marginBottom: "40px" }}
          >
            Free guides, tools, and alerts to protect your money, fight back
            against banks, and grow what you have.
          </p>
          <a href="/newsletter" className="btn-primary">
            Get Free Alerts →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
