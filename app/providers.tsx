"use client"

import { WagmiConfig, createConfig } from "wagmi"  // WagmiConfig use pannu (v1 la common)
import { base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const config = createConfig({
  chains: [base],
  // transports default-a http use pannum – no need http import
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
