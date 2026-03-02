"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { useAccount, useConnect } from "wagmi"

export default function ClientInit() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    async function init() {
      try {
        await sdk.actions.ready()

        if (!isConnected && connectors?.length) {
          const injected = connectors.find(
            (c) => c.id === "injected"
          )

          if (injected) {
            connect({ connector: injected })
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
