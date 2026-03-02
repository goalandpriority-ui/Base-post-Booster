"use client"

import { WagmiConfig, createConfig } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const config = createConfig({
  // wagmi v1 la chains & transports optional – default http use pannum, Base chain MetaMask la auto detect aagum
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
