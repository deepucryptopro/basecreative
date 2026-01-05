"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as fabric from "fabric";

export interface CanvasRef {
    addText: () => void;
    addRect: () => void;
    addCircle: () => void;
    exportPng: () => string;
    addImage: (url: string, type: 'image' | 'sticker') => void;
    updateActiveObject: (property: string, value?: any) => void;
}

interface CanvasBoardProps {
    width?: number;
    height?: number;
}

const CanvasBoard = forwardRef<CanvasRef, CanvasBoardProps>(({ width = 800, height = 600 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<fabric.Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize Canvas
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width,
            height,
            backgroundColor: "#ffffff",
            preserveObjectStacking: true,
            selection: true
        });

        fabricCanvas.current = canvas;

        // Add some default "Wow" content
        const text = new fabric.Textbox("Creative\nFreedom\nOn-Chain", {
            left: width / 2,
            top: height / 3,
            fontFamily: "sans-serif",
            fontWeight: 'bold',
            fontSize: 60,
            textAlign: 'center',
            fill: '#0ea5e9', // Base blue
            originX: 'center',
            originY: 'center'
        });

        // Simple decoration
        const rect = new fabric.Rect({
            left: 50, top: 50, width: width - 100, height: height - 100,
            fill: 'transparent',
            stroke: '#e2e8f0',
            strokeDashArray: [10, 10],
            selectable: false,
            evented: false
        });

        canvas.add(rect);
        canvas.add(text);
        canvas.setActiveObject(text);

        return () => {
            canvas.dispose();
        };
    }, []);

    // Handle Resize
    useEffect(() => {
        if (fabricCanvas.current) {
            fabricCanvas.current.setDimensions({ width, height });
            // Update background or borders if needed
        }
    }, [width, height]);

    useImperativeHandle(ref, () => ({
        addText: () => {
            if (!fabricCanvas.current) return;
            const text = new fabric.Textbox("New Text", {
                left: 300, top: 300, fontSize: 40, fill: "#334155"
            });
            fabricCanvas.current.add(text);
            fabricCanvas.current.setActiveObject(text);
        },
        addRect: () => {
            if (!fabricCanvas.current) return;
            const rect = new fabric.Rect({
                left: 250, top: 250, width: 100, height: 100, fill: "#f43f5e"
            });
            fabricCanvas.current.add(rect);
            fabricCanvas.current.setActiveObject(rect);
        },
        addCircle: () => {
            if (!fabricCanvas.current) return;
            const circle = new fabric.Circle({
                left: 350, top: 250, radius: 50, fill: "#0ea5e9"
            });
            fabricCanvas.current.add(circle);
            fabricCanvas.current.setActiveObject(circle);
        },
        exportPng: () => {
            if (!fabricCanvas.current) return "";
            return fabricCanvas.current.toDataURL({ format: "png", multiplier: 2 });
        },
        addImage: (url: string, type: 'image' | 'sticker') => {
            if (!fabricCanvas.current) return;
            fabric.Image.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
                if (!img) return;

                // Scale logic
                if (type === 'sticker') {
                    img.scaleToWidth(150);
                } else {
                    img.scaleToWidth(400); // Photos larger
                }

                img.set({
                    left: 200,
                    top: 200,
                });

                fabricCanvas.current?.add(img);
                fabricCanvas.current?.setActiveObject(img);
            });
        },
        updateActiveObject: (property: string, value?: any) => {
            if (!fabricCanvas.current) return;
            const activeObj = fabricCanvas.current.getActiveObject();
            if (!activeObj) return;

            // Handle Text Formatting
            if (activeObj instanceof fabric.Textbox || activeObj instanceof fabric.IText) {
                if (property === 'bold') {
                    const current = activeObj.get('fontWeight');
                    activeObj.set('fontWeight', current === 'bold' ? 'normal' : 'bold');
                } else if (property === 'italic') {
                    const current = activeObj.get('fontStyle');
                    activeObj.set('fontStyle', current === 'italic' ? 'normal' : 'italic');
                } else if (property === 'underline') {
                    const current = activeObj.get('underline');
                    activeObj.set('underline', !current);
                } else if (property === 'linethrough') {
                    const current = activeObj.get('linethrough');
                    activeObj.set('linethrough', !current);
                } else if (property === 'textAlign') {
                    activeObj.set('textAlign', value);
                } else {
                    // Direct set (color, fontFamily, fontSize)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    activeObj.set(property as any, value);
                }
                fabricCanvas.current.requestRenderAll();
            } else {
                // Handle generic object properties like color for shapes
                if (property === 'fill') {
                    activeObj.set('fill', value);
                    fabricCanvas.current.requestRenderAll();
                }
            }
        }
    }));

    return (
        <div ref={containerRef} style={{
            flex: 1,
            backgroundColor: "#f8fafc", /* Light background behind canvas */
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative"
        }}>
            <div style={{
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                backgroundColor: "white"
            }}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
});

CanvasBoard.displayName = "CanvasBoard";
export default CanvasBoard;
