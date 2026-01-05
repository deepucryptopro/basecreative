"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect, Suspense } from "react";
import WalletButton from "@/components/WalletButton";
import { useAccount, useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";
import { useSearchParams } from "next/navigation";
import { getTemplateById } from "@/config/templates";

import LeftSidebar from "@/components/Editor/Layout/LeftSidebar";
import RightSidebar from "@/components/Editor/Layout/RightSidebar";
import BottomBar from "@/components/Editor/Layout/BottomBar";
import TopToolbar from "@/components/Editor/Layout/TopToolbar";
import Header from "@/components/Header";
import { CanvasRef } from "@/components/Editor/Layout/CanvasBoard";
import { Layout, Globe, UploadCloud, UserCircle } from "lucide-react";

// Dynamically import CanvasBoard
const CanvasBoard = dynamic(() => import("@/components/Editor/Layout/CanvasBoard"), {
    ssr: false,
    loading: () => <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>
});

function EditorPageContent() {
    const canvasRef = useRef<CanvasRef>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Canvas dimensions state
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    const searchParams = useSearchParams();
    const templateId = searchParams.get('template');

    const { isConnected } = useAccount();
    const { writeContract } = useWriteContract();

    // Template Loading Logic
    useEffect(() => {
        const t = getTemplateById(templateId);
        if (t) {
            setDimensions({ width: t.width, height: t.height });
        } else {
            // Default reset if no template
            setDimensions({ width: 800, height: 600 });
        }

        // Optional: Load specific assets based on ID
        if (templateId && canvasRef.current) {
            // Reset canvas or load predefined state
            // Future: canvasRef.current.loadFromJSON(...)
        }
    }, [templateId]);

    const handleAddText = () => canvasRef.current?.addText();
    const handleAddShape = () => canvasRef.current?.addRect();
    const handleAddAsset = (type: 'image' | 'sticker', url: string) => {
        canvasRef.current?.addImage(url, type);
    };

    const handleFormat = (property: string, value?: any) => {
        canvasRef.current?.updateActiveObject(property, value);
    };

    const handleDownload = () => {
        const data = canvasRef.current?.exportPng();
        if (data) {
            const link = document.createElement("a");
            link.href = data;
            link.download = `base-creative-${Date.now()}.png`;
            link.click();
        }
    };

    const handleSaveIpfs = async () => {
        const data = canvasRef.current?.exportPng();
        if (!data) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/ipfs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: data,
                    name: "My Design",
                    description: "Created with BaseCreative"
                })
            });
            const json = await res.json();
            if (json.success) {
                alert("Saved to IPFS! CID: " + json.metadataCid);
            } else {
                alert("Error: " + json.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error saving.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
            <Header />

            {/* Main Layout Area */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                <LeftSidebar onAddText={handleAddText} onAddShape={handleAddShape} />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                    <TopToolbar onFormat={handleFormat} />

                    {/* Canvas Container with dynamic sizing logic wrapper if needed */}
                    <CanvasBoard
                        ref={canvasRef}
                        width={dimensions.width}
                        height={dimensions.height}
                    />
                </div>

                <RightSidebar onAddAsset={handleAddAsset} />
            </div>

            {/* Footer / Bottom Bar */}
            <BottomBar
                onSaveIpfs={handleSaveIpfs}
                onDownload={handleDownload}
                isSaving={isSaving}
                ipfsReady={false}
            />
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div>Loading Editor...</div>}>
            <EditorPageContent />
        </Suspense>
    );
}
