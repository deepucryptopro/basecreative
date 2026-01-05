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
// @ts-ignore
import { Web3Storage } from "web3.storage";

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

        const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
        if (!token) {
            alert("Missing NEXT_PUBLIC_WEB3_STORAGE_TOKEN in .env.local");
            return;
        }

        setIsSaving(true);
        try {
            const client = new Web3Storage({ token });

            // 1. Convert Data URL to File
            const res = await fetch(data);
            const blob = await res.blob();
            const fileName = `design-${Date.now()}.png`;
            const imageFile = new File([blob], fileName, { type: "image/png" });

            // 2. Upload Image
            console.log("Uploading image to web3.storage...");
            const imageCid = await client.put([imageFile], { wrapWithDirectory: false });
            // By default put matches wrapWithDirectory=true return behavior locally or depends on version.
            // Actually client.put returns the CID of the directory unless wrapWithDirectory: false check.
            // Let's stick to default which wraps in directory for easier gateway access usually: cid/filename
            // But lets try to be clean.
            // If we use wrapWithDirectory: false, the CID is the file itself.
            // However, verify behavior of web3.storage v4.
            // Let's use standard default PUT which returns a CID for the directory.

            const imageRefCid = await client.put([imageFile]);
            const imageUrl = `https://${imageRefCid}.ipfs.dweb.link/${fileName}`;
            console.log("Image Info:", { imageRefCid, imageUrl });

            // 3. Create Metadata
            const metadata = {
                name: "BaseCreative Design",
                description: "Created with BaseCreative",
                image: imageUrl,
                timestamp: new Date().toISOString(),
                attributes: [
                    { trait_type: "Tool", value: "BaseCreative Editor" }
                ]
            };

            const metaFileName = `metadata-${Date.now()}.json`;
            const metaFile = new File([JSON.stringify(metadata, null, 2)], metaFileName, { type: "application/json" });

            // 4. Upload Metadata
            console.log("Uploading metadata to web3.storage...");
            const metadataCid = await client.put([metaFile]);

            // 5. Success
            console.log("Saved to IPFS:", metadataCid);
            alert("Saved to IPFS using web3.storage! Metadata CID: " + metadataCid);

            // Optional: You might want to pass this to the onchain save function
            // setIpfsCid(metadataCid); // If we had state for it

        } catch (e) {
            console.error("IPFS Save Error:", e);
            alert("Failed to save to IPFS. See console.");
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
