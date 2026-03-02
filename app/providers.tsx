"use client"

import { WagmiConfig, createConfig, configureChains } from "wagmi"
import { base } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
)

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
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
