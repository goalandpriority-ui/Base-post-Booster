"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

export default function ClientInit() {

  useEffect(() => {

    const init = async () => {

      try {

        // Farcaster Miniapp ready
        await sdk.actions.ready()

      } catch (error) {

        console.error("Miniapp init failed:", error)

      }

    }

    init()

  }, [])

  return null
}
