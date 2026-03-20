"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

export default function ClientInit() {

  useEffect(() => {

    const init = async () => {

      try {

        // ✅ Farcaster Miniapp ready
        await sdk.actions.ready()

        // -------------------------------
        // 🚀 ADD MINI APP PROMPT LOGIC (YOUR EXISTING)
        // -------------------------------

        const alreadyAdded = localStorage.getItem("miniapp_added")

        if (!alreadyAdded) {

          setTimeout(async () => {

            const confirmAdd = confirm(
              "🚀 Add Base Post Booster?\n\n" +
              "Get:\n" +
              "🔥 Boost alerts\n" +
              "📈 Trending updates\n" +
              "🏆 Leaderboard access"
            )

            if (confirmAdd) {

              localStorage.setItem("miniapp_added", "true")

              console.log("User accepted mini app")

              // -------------------------------
              // 🔥 REAL FARCASTER ADD FLOW
              // -------------------------------
              try {

                const context = await sdk.context

                if (!context?.client?.added) {

                  await sdk.actions.addMiniApp()

                }

              } catch (e) {

                console.log("Add miniapp failed:", e)

              }

              // -------------------------------
              // 🔔 NOTIFICATION PERMISSION
              // -------------------------------
              try {

                await sdk.actions.requestNotifications()

              } catch (e) {

                console.log("Notification permission failed:", e)

              }

            } else {

              console.log("User declined mini app")

            }

          }, 1500)

        }

        // -------------------------------
        // 🔥 AUTO CHECK (NO POPUP FLOW)
        // -------------------------------

        try {

          const context = await sdk.context

          if (!context?.client?.added) {

            console.log("Miniapp not added yet")

          } else {

            console.log("Miniapp already added ✅")

          }

        } catch (e) {

          console.log("Context fetch failed:", e)

        }

        // -------------------------------
        // 🔔 FUTURE NOTIFICATION HOOK
        // -------------------------------

        // Placeholder for:
        // - boost alerts
        // - leaderboard alerts
        // - webhook trigger → Neynar → push

        console.log("Miniapp initialized successfully 🚀")

      } catch (error) {

        console.error("Miniapp init failed:", error)

      }

    }

    init()

  }, [])

  return null
}
