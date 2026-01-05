"use client";

import { Bold, Italic, Underline, Baseline } from "lucide-react";

interface TopToolbarProps {
    onFormat: (property: string, value?: any) => void;
}

export default function TopToolbar({ onFormat }: TopToolbarProps) {
    // We use inline styles for simplicity as per project conventions
    const btnStyle = { padding: "4px", color: "#475569", cursor: "pointer", background: "transparent", border: "none", display: "flex" };
    const colorBtnStyle = { width: "24px", height: "24px", borderRadius: "50%", cursor: "pointer", border: "2px solid #fff", boxShadow: "0 0 0 1px #e2e8f0" };

    return (
        <div style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            padding: "0.5rem 1rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            zIndex: 10
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderRight: "1px solid #e2e8f0", paddingRight: "1rem" }}>
                <select
                    onChange={(e) => onFormat('fontFamily', e.target.value)}
                    style={{ border: "none", fontSize: "0.9rem", fontWeight: "500", color: "#334155", outline: "none", background: "transparent", cursor: "pointer" }}
                >
                    <option value="sans-serif">Inter</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Mono</option>
                    <option value="cursive">Cursive</option>
                </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderRight: "1px solid #e2e8f0", paddingRight: "1rem" }}>
                <input
                    type="number"
                    defaultValue={64}
                    step={4}
                    onChange={(e) => onFormat('fontSize', parseInt(e.target.value))}
                    style={{ width: "48px", border: "none", fontSize: "0.9rem", fontWeight: "500", color: "#334155", outline: "none", background: "transparent" }}
                />
            </div>

            <div style={{ display: "flex", gap: "0.25rem" }}>
                <button onClick={() => onFormat('bold')} style={btnStyle} title="Bold"><Bold size={18} /></button>
                <button onClick={() => onFormat('italic')} style={btnStyle} title="Italic"><Italic size={18} /></button>
                <button onClick={() => onFormat('underline')} style={btnStyle} title="Underline"><Underline size={18} /></button>
                <button onClick={() => onFormat('linethrough')} style={btnStyle} title="Strike"><Baseline size={18} /></button>
            </div>

            <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }}></div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <div onClick={() => onFormat('fill', '#000000')} style={{ ...colorBtnStyle, background: "#000000" }} title="Black"></div>
                <div onClick={() => onFormat('fill', '#ffffff')} style={{ ...colorBtnStyle, background: "#ffffff", boxShadow: "0 0 0 1px #cbd5e1" }} title="White"></div>
                <div onClick={() => onFormat('fill', '#facc15')} style={{ ...colorBtnStyle, background: "#facc15" }} title="Yellow"></div>
                <div onClick={() => onFormat('fill', '#0ea5e9')} style={{ ...colorBtnStyle, background: "#0ea5e9" }} title="Blue"></div>
                <div onClick={() => onFormat('fill', '#ef4444')} style={{ ...colorBtnStyle, background: "#ef4444" }} title="Red"></div>
            </div>
        </div>
    );
}
