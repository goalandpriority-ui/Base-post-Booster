"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { useAccount, useConnect } from "wagmi"

export default function ClientInit() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    const init = async () => {
      try {
        // Hide Farcaster splash
        await sdk.actions.ready()

        // Auto-connect injected wallet (like MetaMask)
        if (!isConnected && connectors?.length) {
          const injectedConnector = connectors.find(
            (connector) => connector.id === "injected"
          )

          if (injectedConnector) {
            connect({ connector: injectedConnector })
          }
        }
      } catch (err) {
        console.error("Miniapp init failed:", err)
      }
    }

    init()
  }, [isConnected, connectors, connect])

  return null
}
