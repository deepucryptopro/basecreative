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
    const [isMinting, setIsMinting] = useState(false);

    // Canvas dimensions state
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    const searchParams = useSearchParams();
    const templateId = searchParams.get('template');

    const { isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

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

    const uploadToIpfs = async (): Promise<string | null> => {
        const data = canvasRef.current?.exportPng();
        if (!data) return null;

        const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
        if (!token) {
            alert("Missing NEXT_PUBLIC_WEB3_STORAGE_TOKEN in .env.local");
            return null;
        }

        const client = new Web3Storage({ token });

        // 1. Convert Data URL to File
        const res = await fetch(data);
        const blob = await res.blob();
        const fileName = `design-${Date.now()}.png`;
        const imageFile = new File([blob], fileName, { type: "image/png" });

        // 2. Upload Image
        console.log("Uploading image to web3.storage...");
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
        return metadataCid;
    };

    const handleSaveIpfs = async () => {
        setIsSaving(true);
        try {
            const metadataCid = await uploadToIpfs();
            if (metadataCid) {
                console.log("Saved to IPFS:", metadataCid);
                alert("Saved to IPFS using web3.storage! Metadata CID: " + metadataCid);
            }
        } catch (e) {
            console.error("IPFS Save Error:", e);
            alert("Failed to save to IPFS. See console.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleMint = async () => {
        if (!isConnected) {
            alert("Please connect wallet to mint NFT");
            return;
        }

        setIsMinting(true);
        try {
            const metadataCid = await uploadToIpfs();
            if (!metadataCid) {
                throw new Error("Failed to upload metadata to IPFS");
            }

            console.log("Minting with CID:", metadataCid);
            const txHash = await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'mintNFT',
                args: [metadataCid],
            });

            alert(`Minting successful! Transaction Hash: ${txHash}`);
        } catch (e) {
            console.error("Minting Error:", e);
            alert("Minting failed. See console for details.");
        } finally {
            setIsMinting(false);
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
                onMint={handleMint}
                isSaving={isSaving}
                isMinting={isMinting}
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
