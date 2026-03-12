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

        // Farcaster Miniapp ready
        await sdk.actions.ready()

        // Auto connect injected wallet (Warpcast wallet)
        if (!isConnected && connectors?.length > 0) {

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

  }, [isConnected, connectors, connect])

  return null
}
