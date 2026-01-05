"use client";

import Link from "next/link";
import WalletButton from "@/components/WalletButton";
import { Layout, Globe, UploadCloud, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header style={{
            height: "64px",
            backgroundColor: "white",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            flexShrink: 0
        }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "24px", height: "24px", background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)", borderRadius: "6px" }}></div>
                    <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#3b82f6" }}>BaseCreative</span>
                </div>
            </Link>

            {/* Nav Links */}
            <div style={{ display: "flex", gap: "2rem", color: "#64748b", fontSize: "0.9rem", fontWeight: "500" }}>
                <Link
                    href="/gallery"
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        cursor: "pointer",
                        color: isActive("/gallery") ? "#0ea5e9" : "inherit",
                        textDecoration: "none"
                    }}
                >
                    <Layout size={16} /> Gallery
                </Link>
                <Link
                    href="/templates"
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        cursor: "pointer",
                        color: isActive("/templates") ? "#0ea5e9" : "inherit",
                        textDecoration: "none"
                    }}
                >
                    Templates
                </Link>
                <Link
                    href="/explore"
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        cursor: "pointer",
                        color: isActive("/explore") ? "#0ea5e9" : "inherit",
                        textDecoration: "none"
                    }}
                >
                    <Globe size={16} /> Explore
                </Link>
            </div>

            {/* Right Actions */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <WalletButton />
                <button style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }} title="Upload (In Editor)"><UploadCloud size={20} /></button>
                <button style={{ color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}><UserCircle size={24} /></button>
            </div>
        </header>
    );
}
