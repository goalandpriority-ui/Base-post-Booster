"use client"

import { WagmiProvider, createConfig } from "wagmi"
import { http } from "viem"  // ← http viem-la irundhu import pannu (v2-la correct)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base } from "wagmi/chains"

export const config = createConfig({
  chains: [base],  // ← MUST irukkanum
  transports: {
    [base.id]: http(),  // viem http use pannu
  },
  ssr: true,  // Next.js hydration fix
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
