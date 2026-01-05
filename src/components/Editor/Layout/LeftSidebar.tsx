"use client";

import { Type, Image as ImageIcon, Shapes, Smile, Layers } from "lucide-react";

interface ToolButtonProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isActive?: boolean;
}

function ToolButton({ icon: Icon, label, onClick, isActive }: ToolButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "1rem 0",
                gap: "0.5rem",
                color: isActive ? "#0ea5e9" : "#64748b",
                backgroundColor: isActive ? "#f0f9ff" : "transparent",
                borderLeft: isActive ? "3px solid #0ea5e9" : "3px solid transparent",
                transition: "all 0.2s",
            }}
        >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>{label}</span>
        </button>
    );
}

interface LeftSidebarProps {
    onAddText: () => void;
    onAddShape: () => void;
}

export default function LeftSidebar({ onAddText, onAddShape }: LeftSidebarProps) {
    return (
        <aside style={{
            width: "90px",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            paddingTop: "1rem",
            flexShrink: 0,
        }}>
            <ToolButton icon={Type} label="Text" onClick={onAddText} />
            <ToolButton icon={ImageIcon} label="Images" onClick={() => alert("Drag & drop coming soon!")} />
            <ToolButton icon={Shapes} label="Shapes" onClick={onAddShape} />
            <ToolButton icon={Smile} label="Stickers" onClick={() => { }} />
            <ToolButton icon={Layers} label="Layers" onClick={() => { }} />
        </aside>
    );
}
