"use client";

import { Search, Upload } from "lucide-react";
import { STICKERS, PHOTOS } from "@/config/assets";
import { useRef } from "react";
import Image from "next/image";

interface RightSidebarProps {
    onAddAsset: (type: 'image' | 'sticker', url: string) => void;
}

export default function RightSidebar({ onAddAsset }: RightSidebarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (evt.target?.result) {
                    onAddAsset('image', evt.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        if (e.target) e.target.value = '';
    };

    return (
        <aside style={{
            width: "320px",
            backgroundColor: "#ffffff",
            borderLeft: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
        }}>
            {/* Header */}
            <div style={{
                padding: "1rem",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#1e293b" }}>Asset Library</h3>
                <Search size={18} color="#94a3b8" />
            </div>

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
            />

            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
                {/* Photos Section */}
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h4 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#475569", margin: 0 }}>Photos</h4>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                        {/* Upload Button */}
                        <button
                            onClick={handleUploadClick}
                            style={{
                                aspectRatio: "1",
                                borderRadius: "8px",
                                border: "2px dashed #cbd5e1",
                                backgroundColor: "#f8fafc",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                color: "#64748b",
                                cursor: "pointer"
                            }}
                        >
                            <Upload size={20} />
                            <span style={{ fontSize: "0.7rem", fontWeight: 500 }}>Upload</span>
                        </button>

                        {PHOTOS.map((photo) => (
                            <button
                                key={photo.id}
                                onClick={() => onAddAsset('image', photo.src)}
                                style={{
                                    aspectRatio: "1",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    position: "relative"
                                }}
                            >
                                {/* We use standard img for SVGs to ensure they render simply, or Next Image */}
                                <img src={photo.src} alt={photo.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stickers Section */}
                <div>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#475569", marginBottom: "1rem" }}>Stickers</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
                        {STICKERS.map((sticker) => (
                            <button
                                key={sticker.id}
                                onClick={() => onAddAsset('sticker', sticker.src)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "transparent",
                                    border: "1px solid transparent",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    padding: "4px",
                                    transition: "background 0.2s"
                                }}
                                className="sticker-btn"
                            >
                                <img src={sticker.src} alt={sticker.label} style={{ width: "100%", height: "auto" }} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
        .sticker-btn:hover {
          background-color: #f1f5f9;
          border-color: #e2e8f0 !important;
        }
      `}</style>
        </aside>
    );
}
