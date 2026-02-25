import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, publicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient
});
