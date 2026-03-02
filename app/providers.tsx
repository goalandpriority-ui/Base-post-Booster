"use client"

import { WagmiProvider, createConfig } from "wagmi"
import { http } from "viem"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

export const config = createConfig({
  chains: [base],

  connectors: [
    injected(), // Base app / MetaMask / Farcaster injected wallets
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],

  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },

  ssr: true,
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
