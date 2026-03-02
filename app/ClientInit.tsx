"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { useConnect, useAccount } from "wagmi"

export default function ClientInit() {
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()

  useEffect(() => {
    // Tell Farcaster app we are ready
    sdk.actions.ready()

    async function autoConnect() {
      if (isConnected) return

      // Try injected connector first (Base app / Farcaster wallet)
      const injectedConnector = connectors.find(
        (c) => c.type === "injected"
      )

      if (injectedConnector) {
        try {
          await connect({ connector: injectedConnector })
          return
        } catch (err) {
          console.log("Injected connect failed")
        }
      }

      // Fallback to WalletConnect
      const wcConnector = connectors.find(
        (c) => c.type === "walletConnect"
      )

      if (wcConnector) {
        await connect({ connector: wcConnector })
      }
    }

    autoConnect()
  }, [connect, connectors, isConnected])

  return null
}
