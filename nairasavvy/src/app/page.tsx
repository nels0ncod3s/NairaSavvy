import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import NairaGuardDashboard from "@/components/home/NairaGuardDashboard"

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8", minHeight: "60vh" }}>
        {/* Hero */}
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
          <h1
            className="type-display"
            style={{ color: "#1A1A1A", marginBottom: "24px" }}
          >
            Nigeria's financial system
            <br />
            wasn't built for you.
            <br />
            <span style={{ color: "#1B5E3B" }}>NairaSavvy was.</span>
          </h1>
          <p
            className="type-body"
            style={{
              color: "#6B6560",
              maxWidth: "560px",
              marginBottom: "40px",
            }}
          >
            Free guides, tools, and alerts to protect your money, fight back
            against banks, and grow what you have.
          </p>
          <a href="/newsletter" className="btn-primary">
            Get Free Alerts &rarr;
          </a>
        </div>

        {/* NairaGuard Dashboard Section */}
        <section
          id="naira-guard"
          style={{ padding: "0 24px 100px" }}
        >
          <div className="container-content">
            <NairaGuardDashboard />
          </div>
        </section>

        {/* Quick Links */}
        <section
          style={{
            padding: "0 24px 100px",
            backgroundColor: "#0F0F0D",
          }}
        >
          <div className="container-content">
            <h2
              className="type-h2"
              style={{ color: "#FFFFFF", marginBottom: "40px" }}
            >
              What do you need help with?
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {[
                {
                  title: "Protect Your Savings",
                  desc: "See which accounts beat inflation",
                  href: "/savings",
                },
                {
                  title: "Cut Data Costs",
                  desc: "Find hidden deals on data plans",
                  href: "/cut-costs/data-plans",
                },
                {
                  title: "Stay Informed",
                  desc: "CBN circulars explained simply",
                  href: "/news",
                },
                {
                  title: "Fight Back",
                  desc: "Know your rights as a consumer",
                  href: "/fight-back",
                },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#1C1C1A",
                      border: "1px solid #333331",
                      borderRadius: "4px",
                      padding: "24px",
                      height: "100%",
                      transition:
                        "transform 0.2s ease, border-color 0.2s ease",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-serif, Georgia, serif)",
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        margin: "0 0 8px",
                      }}
                    >
                      {link.title}
                    </h3>
                    <p
                      className="type-body"
                      style={{ color: "#888884", margin: 0 }}
                    >
                      {link.desc}
                    </p>
                    <span
                      style={{
                        color: "#1B5E3B",
                        fontSize: "14px",
                        fontWeight: 600,
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        marginTop: "12px",
                        display: "block",
                      }}
                    >
                      Learn more &rarr;
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
