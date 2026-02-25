"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import { base } from "wagmi/chains"

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http()
  }
})

export function WalletProvider({ children }: any) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>
}
