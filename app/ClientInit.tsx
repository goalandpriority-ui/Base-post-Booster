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

        // Farcaster Miniapp ready signal
        await sdk.actions.ready()

        // Wallet auto connect
        if (!isConnected && connectors?.length > 0) {
          connect({
            connector: connectors[0],
          })
        }

      } catch (error) {

        console.error("Miniapp init failed:", error)

      }

    }

    init()

  }, [isConnected, connectors, connect])

  return null
}
