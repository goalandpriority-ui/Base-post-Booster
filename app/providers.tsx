"use client"

import { WagmiProvider, createConfig } from "wagmi"
import { http } from "viem"                    // ← viem-la irundhu import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base } from "wagmi/chains"

export const config = createConfig({
  chains: [base],                             // ← idhu MUST (single chain ok)
  transports: {
    [base.id]: http(),                        // default public RPC
    // or custom: http('https://mainnet.base.org')
  },
  ssr: true,                                  // Next.js hydration avoid
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
