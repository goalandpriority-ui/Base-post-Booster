'use client'
import { FC, ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '../wagmiConfig';

interface Props {
  children: ReactNode;
}

const WalletProvider: FC<Props> = ({ children }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};

export default WalletProvider;
