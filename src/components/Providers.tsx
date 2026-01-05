"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    const [config] = useState(() =>
        createConfig({
            chains: [base],
            transports: {
                [base.id]: http(),
            },
            connectors: [
                injected(),
            ],
        })
    );

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
