"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { ExternalLink, Image as ImageIcon } from "lucide-react";

interface SavedDesign {
    cid: string;
    image: string;
    name: string;
    timestamp: string;
}

export default function ExplorePage() {
    const [designs, setDesigns] = useState<SavedDesign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDesigns = () => {
            try {
                const saved = localStorage.getItem("savedDesigns");
                if (saved) {
                    setDesigns(JSON.parse(saved));
                }
            } catch (error) {
                console.error("Failed to load designs:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDesigns();
    }, []);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
            <Header />
            <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e293b", marginBottom: "0.5rem" }}>My IPFS Gallery</h1>
                    <p style={{ color: "#64748b" }}>Your locally saved designs uploaded to IPFS.</p>
                </div>

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                        Loading...
                    </div>
                ) : designs.length === 0 ? (
                    <div style={{
                        padding: "4rem",
                        background: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem"
                    }}>
                        <ImageIcon size={48} style={{ color: "#94a3b8" }} />
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}>No designs found</h2>
                        <p style={{ color: "#64748b" }}>Go to the editor and specific "Save to IPFS" to see them here.</p>
                        <a href="/" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block", padding: "0.75rem 1.5rem", background: "var(--primary)", color: "white", borderRadius: "8px", textDecoration: "none" }}>
                            Go to Editor
                        </a>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.5rem"
                    }}>
                        {designs.map((design, index) => (
                            <div key={index} style={{
                                background: "white",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                                transition: "all 0.2s",
                                border: "1px solid #e2e8f0"
                            }}>
                                <div style={{ aspectRatio: "4/3", overflow: "hidden", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f1f5f9" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={design.image}
                                        alt={design.name}
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                </div>
                                <div style={{ padding: "1rem" }}>
                                    <h3 style={{ fontWeight: "600", color: "#0f172a", marginBottom: "0.25rem" }}>{design.name}</h3>
                                    <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "1rem" }}>
                                        {new Date(design.timestamp).toLocaleDateString()} • {new Date(design.timestamp).toLocaleTimeString()}
                                    </p>

                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <a
                                            href={`https://ipfs.io/ipfs/${design.cid}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "0.5rem",
                                                padding: "0.5rem",
                                                fontSize: "0.875rem",
                                                color: "#475569",
                                                background: "#f8fafc",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "6px",
                                                textDecoration: "none",
                                                fontWeight: 500
                                            }}
                                        >
                                            <ExternalLink size={14} />
                                            Metadata CID
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
