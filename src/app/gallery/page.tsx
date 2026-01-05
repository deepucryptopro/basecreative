"use client";

import Header from "@/components/Header";
import { FolderOpen } from "lucide-react";

export default function GalleryPage() {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
            <Header />
            <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", color: "#64748b" }}>
                <div style={{ padding: "2rem", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)", textAlign: "center" }}>
                    <FolderOpen size={48} style={{ marginBottom: "1rem", color: "#94a3b8" }} />
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}>Your Gallery</h2>
                    <p>Your saved designs will appear here.</p>
                </div>
            </main>
        </div>
    );
}
