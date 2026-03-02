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
        await sdk.actions.ready()

        if (!isConnected && connectors?.length) {
          const injectedConnector = connectors.find(
            (c) => c.id === "injected"
          )

          if (injectedConnector) {
            connect({ connector: injectedConnector })
          }
        }
      } catch (error) {
        console.error("Miniapp init failed:", error)
      }
    }

    init()
  }, [isConnected, connect, connectors])

  return null
}
