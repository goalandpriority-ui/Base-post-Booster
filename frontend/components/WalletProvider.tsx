"use client"
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '../wagmiConfig'

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
