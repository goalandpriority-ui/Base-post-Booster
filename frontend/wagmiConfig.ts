// wagmiConfig.ts
import { configureChains, createClient } from "wagmi"
import { mainnet, goerli } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
)

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})
