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

        // Farcaster splash screen remove
        await sdk.actions.ready()

        // Auto connect Farcaster wallet
        if (!isConnected && connectors.length > 0) {
          connect({ connector: connectors[0] })
        }

      } catch (err) {

        console.error("Miniapp init failed:", err)

      }

    }

    init()

  }, [isConnected, connectors, connect])

  return null
}
