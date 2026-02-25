// wagmiConfig.ts
import { configureChains, createConfig } from 'wagmi'
import { base, localhost } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

// Base chain only
const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()]
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient
})
