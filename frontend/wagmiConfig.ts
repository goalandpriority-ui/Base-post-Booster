import { configureChains, createConfig, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

// Base chain id 8453
const BASE_CHAIN_ID = 8453

export const chains = [
  {
    id: BASE_CHAIN_ID,
    name: 'Base',
    network: 'base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: 'https://mainnet.base.org' },
    blockExplorers: { default: { name: 'BaseScan', url: 'https://basescan.org' } },
    testnet: false,
  },
]

const { publicClient, webSocketPublicClient } = configureChains(chains, [publicProvider()])

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})
