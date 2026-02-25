'use client'

import { configureChains, createConfig } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export const { publicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
})
