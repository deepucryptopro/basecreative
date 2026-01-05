import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { image, name, description } = await request.json();

        if (!image || !name) {
            return NextResponse.json({ error: "Missing image data" }, { status: 400 });
        }

        const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
        const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

        if (!pinataApiKey || !pinataSecretApiKey) {
            return NextResponse.json({ error: "Server missing IPFS keys" }, { status: 500 });
        }

        // 1. Convert Base64 image to Blob/File for upload
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const blob = new Blob([buffer], { type: "image/png" });

        // 2. Upload Image
        const formData = new FormData();
        formData.append("file", blob, "design.png");

        const metadata = JSON.stringify({
            name: `BaseCreative Image - ${name}`,
        });
        formData.append("pinataMetadata", metadata);

        const options = JSON.stringify({
            cidVersion: 1,
        });
        formData.append("pinataOptions", options);

        const imageUploadRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey,
            },
            body: formData,
        });

        if (!imageUploadRes.ok) {
            throw new Error("Failed to upload image to IPFS");
        }

        const imageJson = await imageUploadRes.json();
        const imageCid = imageJson.IpfsHash;

        // 3. Upload Metadata JSON (ERC-721 style)
        const nftMetadata = {
            name: name,
            description: description || "Created with BaseCreative",
            image: `ipfs://${imageCid}`,
            external_url: "https://base-creative.vercel.app",
            attributes: [
                {
                    trait_type: "Tool",
                    value: "BaseCreative Editor",
                },
            ],
        };

        const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey,
            },
            body: JSON.stringify({
                pinataContent: nftMetadata,
                pinataMetadata: {
                    name: `BaseCreative Metadata - ${name}`,
                },
            }),
        });

        if (!metadataRes.ok) {
            throw new Error("Failed to upload metadata to IPFS");
        }

        const metadataJson = await metadataRes.json();
        const metadataCid = metadataJson.IpfsHash;

        return NextResponse.json({
            success: true,
            imageCid,
            metadataCid,
            ipfsUrl: `ipfs://${metadataCid}`
        });

    } catch (error) {
        console.error("IPFS Upload Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
