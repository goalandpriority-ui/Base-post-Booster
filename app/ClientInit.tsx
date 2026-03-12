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

        if (!isConnected && connectors.length > 0) {

          const injected = connectors.find(
            (c) => c.id === "injected"
          )

          if (injected) {
            connect({ connector: injected })
          } else {
            connect({ connector: connectors[0] })
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
