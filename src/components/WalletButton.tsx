"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function WalletButton() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button onClick={() => disconnect()} className="btn btn-outline" style={{ padding: "0.25rem 0.75rem", fontSize: "0.8rem" }}>
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => connect({ connector: connectors[0] })}
            className="btn btn-primary"
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
        >
            Connect Wallet
        </button>
    );
}
