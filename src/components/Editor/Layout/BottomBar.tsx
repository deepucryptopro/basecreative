"use client";

import { Cloud, Download, Hexagon } from "lucide-react";

interface BottomBarProps {
    onSaveIpfs: () => void;
    onDownload: () => void;
    onMint: () => void;
    isSaving: boolean;
    isMinting: boolean;
    ipfsReady: boolean;
}

export default function BottomBar({ onSaveIpfs, onDownload, onMint, isSaving, isMinting, ipfsReady }: BottomBarProps) {
    return (
        <div style={{
            height: "80px",
            backgroundColor: "white",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
            flexShrink: 0
        }}>
            <button
                onClick={onSaveIpfs}
                className="btn btn-outline"
                style={{ gap: "0.5rem", height: "44px" }}
                disabled={isSaving || isMinting}
            >
                <Cloud size={18} />
                {isSaving ? "Uploading..." : "Save to IPFS"}
            </button>

            <button
                onClick={onMint}
                disabled={isSaving || isMinting}
                className="btn btn-primary"
                style={{ gap: "0.5rem", height: "44px", padding: "0 2rem", fontSize: "1rem", background: "#3b82f6" }}
            >
                <Hexagon size={18} />
                {isMinting ? "Minting..." : "Mint as NFT"}
            </button>

            <div style={{ display: "flex" }}>
                <button
                    onClick={onDownload}
                    className="btn btn-outline"
                    style={{
                        gap: "0.5rem",
                        height: "44px",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                    }}
                >
                    <Download size={18} />
                    Download
                </button>
                <button
                    className="btn btn-outline"
                    style={{
                        height: "44px",
                        padding: "0 0.75rem",
                        borderLeft: "none",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    }}
                >
                    ▼
                </button>
            </div>
        </div>
    );
}
