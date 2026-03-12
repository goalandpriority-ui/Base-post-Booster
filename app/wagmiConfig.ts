"use client"

import { createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { coinbaseWallet, walletConnect } from "wagmi/connectors"

export const wagmiConfig = createConfig({
  chains: [base],

  connectors: [
    coinbaseWallet({
      appName: "Base Post Booster",
    }),

    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
    }),
  ],

  transports: {
    [base.id]: http(),
  },
})
