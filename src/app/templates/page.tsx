"use client";

import Header from "@/components/Header";
import Link from "next/link";

const TEMPLATES = [
    { id: 1, name: "Social Post", color: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)" },
    { id: 2, name: "Story", color: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)" },
    { id: 3, name: "Banner", color: "linear-gradient(135deg, #dcfce7 0%, #86efac 100%)" },
    { id: 4, name: "Meme", color: "linear-gradient(135deg, #fef9c3 0%, #fde047 100%)" },
];

export default function TemplatesPage() {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
            <Header />
            <main style={{ flex: 1, padding: "3rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e293b", marginBottom: "2rem" }}>Start with a Template</h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", width: "100%", maxWidth: "1000px" }}>
                    {TEMPLATES.map(t => (
                        <Link href={`/editor?template=${t.id}`} key={t.id} style={{ textDecoration: "none" }}>
                            <div style={{
                                aspectRatio: "3/4",
                                background: t.color,
                                borderRadius: "16px",
                                padding: "1.5rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                <span style={{ fontSize: "1.25rem", fontWeight: "600", color: "#334155" }}>{t.name}</span>
                                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>Click to Edit</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
