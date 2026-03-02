"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { injected } from "@wagmi/connectors"  // Correct import

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [injected()],
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
