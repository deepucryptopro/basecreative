import Link from "next/link";

export default function Home() {
  return (
    <div className="container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <main>
        <h1 style={{ fontSize: "4rem", fontWeight: "800", letterSpacing: "-0.05em", marginBottom: "1rem", background: "linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Base Creative
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#64748b", marginBottom: "2.5rem", maxWidth: "600px" }}>
          A decentralized design studio for the open web. specific for Base.
        </p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/editor" className="btn btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "1.1rem" }}>
            Start Designing
          </Link>
          <Link href="/gallery" className="btn btn-outline" style={{ padding: "0.75rem 2rem", fontSize: "1.1rem" }}>
            View Gallery
          </Link>
        </div>
      </main>

      <footer style={{ marginTop: "4rem", color: "#94a3b8", fontSize: "0.875rem" }}>
        <p>Built on Base • 100% Onchain Logic Optional</p>
      </footer>
    </div>
  );
}
