"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { useAccount, useConnect } from "wagmi"

export default function ClientInit() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    async function init() {
      try {
        await sdk.actions.ready()

        // Auto connect injected wallet if not connected
        if (!isConnected && connectors.length > 0) {
          const injectedConnector = connectors.find(
            (c) => c.id === "injected"
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
  }, [isConnected, connect, connectors])

  return null
}
