'use client'

import { PropsWithChildren } from 'react'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '../wagmiConfig'

export function WalletProvider({ children }: PropsWithChildren) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
