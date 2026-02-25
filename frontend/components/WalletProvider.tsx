"use client"

import { ReactNode, createContext, useContext } from "react"
import { WagmiConfig, useAccount } from "wagmi"
import { wagmiClient, chains } from "../wagmiConfig"

type WalletContextType = {
  account?: ReturnType<typeof useAccount>["address"]
}

const WalletContext = createContext<WalletContextType>({})

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount()
  return (
    <WagmiConfig client={wagmiClient}>
      <WalletContext.Provider value={{ account: address }}>
        {children}
      </WalletContext.Provider>
    </WagmiConfig>
  )
}

export const useWallet = () => useContext(WalletContext)
