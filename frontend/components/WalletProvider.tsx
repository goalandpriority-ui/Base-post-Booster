"use client"

import { ReactNode } from "react"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { base, goerli } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base, goerli],
  [publicProvider()]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
