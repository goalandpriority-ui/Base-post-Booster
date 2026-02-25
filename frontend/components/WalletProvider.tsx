"use client"

import { ReactNode } from "react"
import { WagmiConfig } from "wagmi"
import { wagmiConfig } from "../wagmiConfig"

export default function WalletProvider({ children }: { children: ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
