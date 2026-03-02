"use client"

import { WagmiProvider, createConfig, http } from "wagmi"  // ← WagmiProvider + http from 'wagmi'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base } from "wagmi/chains"  // ← correct import

// Config create pannu with BOTH chains and transports
export const config = createConfig({
  chains: [base],  // ← MUST add this! (single chain ok)
  transports: {
    [base.id]: http(),  // default public RPC use pannum (or custom URL podalam later)
  },
  ssr: true,  // ← Next.js SSR hydration issues avoid pannum
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>  // ← WagmiConfig → WagmiProvider change pannu
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
