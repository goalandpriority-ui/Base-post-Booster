"use client"

import { WagmiConfig, createConfig } from "wagmi"
import { http } from "viem"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base } from "wagmi/chains"

const config = createConfig({
  transports: {
    [base.id]: http(), // Base chain ku http transport – idhu type ok aagum
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
