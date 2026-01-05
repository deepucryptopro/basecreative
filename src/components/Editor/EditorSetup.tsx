"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
// @ts-ignore
import { Web3Storage } from "web3.storage";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";

interface EditorSetupProps {
    onExport: (dataUrl: string) => void;
}

export default function EditorSetup({ onExport }: EditorSetupProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [ipfsCid, setIpfsCid] = useState<string | null>(null);

    // Blockchain Hooks
    const { address, isConnected, chainId } = useAccount();
    const { switchChain } = useSwitchChain();
    const { writeContract, isPending: isTxPending } = useWriteContract();

    // Initialize Canvas
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: "#ffffff",
            preserveObjectStacking: true, // Keep layers order
        });

        setFabricCanvas(canvas);

        return () => {
            canvas.dispose();
        };
    }, []);

    // Add Rectangle
    const addRect = () => {
        if (!fabricCanvas) return;
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "#0ea5e9", // Primary blue
            width: 100,
            height: 100,
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
    };

    // Add Circle
    const addCircle = () => {
        if (!fabricCanvas) return;
        const circle = new fabric.Circle({
            left: 150,
            top: 150,
            fill: "#f43f5e", // Rose
            radius: 50,
        });
        fabricCanvas.add(circle);
        fabricCanvas.setActiveObject(circle);
    };

    // Add Text
    const addText = () => {
        if (!fabricCanvas) return;
        const text = new fabric.Textbox("Start Creating", {
            left: 200,
            top: 200,
            width: 200,
            fontSize: 24,
            fontFamily: "sans-serif",
            fill: "#1e293b",
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
    };

    // Layer Controls
    const bringForward = () => {
        const activeObj = fabricCanvas?.getActiveObject();
        if (activeObj && fabricCanvas) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (fabricCanvas as any).bringForward?.(activeObj);
            // Fallback if method is different in v6
            if (!((fabricCanvas as any).bringForward) && (activeObj as any).bringForward) {
                (activeObj as any).bringForward();
            }
            fabricCanvas.requestRenderAll();
        }
    };

    const sendBackward = () => {
        const activeObj = fabricCanvas?.getActiveObject();
        if (activeObj && fabricCanvas) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (fabricCanvas as any).sendBackwards?.(activeObj);
            // Fallback
            if (!((fabricCanvas as any).sendBackwards) && (activeObj as any).sendBackwards) {
                (activeObj as any).sendBackwards();
            }
            fabricCanvas.requestRenderAll();
        }
    };

    // Export
    const handleExport = () => {
        if (!fabricCanvas) return;
        const dataDisplay = fabricCanvas.toDataURL({
            format: "png",
            multiplier: 2 // High res
        });
        onExport(dataDisplay);

        // Download logic
        const link = document.createElement("a");
        link.href = dataDisplay;
        link.download = `base-creative-${Date.now()}.png`;
        link.click();
    };

    // IPFS Upload
    const handleSaveToIpfs = async () => {
        if (!fabricCanvas) return;
        const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

        if (!token) {
            alert("Please set NEXT_PUBLIC_WEB3_STORAGE_TOKEN in your .env.local file");
            return;
        }

        setIsUploading(true);
        setIpfsCid(null);

        try {
            const client = new Web3Storage({ token });

            // 1. Get Image
            const dataUrl = fabricCanvas.toDataURL({
                format: "png",
                multiplier: 2
            });
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const fileName = `design-${Date.now()}.png`;
            const imageFile = new File([blob], fileName, { type: "image/png" });

            // 2. Upload Image
            // We upload just the file. returns root CID for directory containing the file
            console.log("Uploading image...");
            const imageCid = await client.put([imageFile]);
            const imageUrl = `https://${imageCid}.ipfs.dweb.link/${fileName}`;
            console.log("Image uploaded:", imageUrl);

            // 3. Create Metadata
            const metadata = {
                name: "Base Creative Design",
                timestamp: new Date().toISOString(),
                image: imageUrl,
                imageCid: imageCid
            };

            const metaFileName = `metadata-${Date.now()}.json`;
            const metaFile = new File([JSON.stringify(metadata, null, 2)], metaFileName, { type: "application/json" });

            // 4. Upload Metadata
            console.log("Uploading metadata...");
            const metaCid = await client.put([metaFile]);
            console.log("Metadata uploaded:", metaCid);

            setIpfsCid(metaCid);

            // Save to Local Storage for Gallery
            const savedDesign = {
                cid: metaCid,
                image: imageUrl,
                name: metadata.name,
                timestamp: metadata.timestamp
            };

            const existingDesigns = JSON.parse(localStorage.getItem("savedDesigns") || "[]");
            localStorage.setItem("savedDesigns", JSON.stringify([savedDesign, ...existingDesigns]));

        } catch (error) {
            console.error("IPFS Upload Error:", error);
            alert("Failed to upload to IPFS. Check console for details.");
        } finally {
            setIsUploading(false);
        }
    };

    // Onchain Save
    const handleSaveOnChain = async () => {
        if (!ipfsCid) return;

        if (!isConnected) {
            alert("Please connect your wallet to save onchain.");
            return;
        }

        if (chainId !== base.id) {
            alert("Switching to Base network...");
            switchChain({ chainId: base.id });
            return;
        }

        try {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "saveDesign",
                args: [ipfsCid],
            }, {
                onSuccess: (hash) => {
                    console.log("Transaction sent:", hash);
                    alert(`Transaction Sent! Hash: ${hash}`);
                },
                onError: (error) => {
                    console.error("Transaction failed:", error);
                    alert("Transaction failed. See console.");
                }
            });
        } catch (error) {
            console.error("Error saving onchain:", error);
        }
    };

    return (
        <div className="editor-layout" style={{ display: "flex", height: "calc(100vh - 80px)", gap: "20px" }}>
            {/* Sidebar */}
            <aside style={{
                width: "260px",
                backgroundColor: "var(--background)",
                borderRight: "1px solid var(--border)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
            }}>
                <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tools</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <button onClick={addText} className="tool-btn">
                            <span style={{ fontSize: "1.25rem" }}>T</span>
                            <span>Text</span>
                        </button>
                        <button onClick={addRect} className="tool-btn">
                            <div style={{ width: "20px", height: "14px", background: "#0ea5e9", borderRadius: "2px" }}></div>
                            <span>Rect</span>
                        </button>
                        <button onClick={addCircle} className="tool-btn">
                            <div style={{ width: "16px", height: "16px", background: "#f43f5e", borderRadius: "50%" }}></div>
                            <span>Circle</span>
                        </button>
                    </div>
                </div>

                <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Layers</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={bringForward} className="btn btn-outline" style={{ flex: 1, fontSize: "0.8rem" }}>Up</button>
                        <button onClick={sendBackward} className="btn btn-outline" style={{ flex: 1, fontSize: "0.8rem" }}>Down</button>
                    </div>
                </div>

                <div style={{ marginTop: "auto" }}>
                    <button onClick={handleExport} className="btn btn-primary" style={{ width: "100%", marginBottom: "0.5rem" }}>
                        Export PNG
                    </button>
                    <button
                        onClick={handleSaveToIpfs}
                        disabled={isUploading}
                        className="btn btn-outline"
                        style={{ width: "100%", position: "relative" }}
                    >
                        {isUploading ? "Uploading..." : "Save to IPFS"}
                    </button>
                    {ipfsCid && (
                        <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ fontSize: "0.75rem", wordBreak: "break-all", background: "var(--secondary)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                                <strong>CID:</strong> {ipfsCid}
                            </div>

                            <button
                                onClick={handleSaveOnChain}
                                disabled={isTxPending}
                                className="btn btn-primary"
                                style={{
                                    width: "100%",
                                    background: "linear-gradient(to right, #2563eb, #7c3aed)",
                                    fontSize: "0.875rem"
                                }}
                            >
                                {isTxPending ? "Saving..." : "Save Onchain (Base)"}
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Board */}
            <main ref={containerRef} style={{
                flex: 1,
                backgroundColor: "var(--secondary)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                borderRadius: "var(--radius-lg)"
            }}>
                <div style={{
                    boxShadow: "var(--shadow-md)",
                    borderRadius: "0", /* Canvas is square usually, can add border radius if desired */
                    overflow: "hidden"
                }}>
                    <canvas ref={canvasRef} />
                </div>
            </main>

            <style jsx>{`
        .tool-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: var(--secondary);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--foreground);
          transition: all 0.2s;
        }
        .tool-btn:hover {
          background-color: #fff;
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
      `}</style>
        </div>
    );
}
