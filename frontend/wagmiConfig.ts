"use client"

import { createConfig, configureChains } from "wagmi"
import { base } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"

const { publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: []
})
