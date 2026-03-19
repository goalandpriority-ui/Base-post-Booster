import "./globals.css"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import ClientInit from "./ClientInit"
import Providers from "./providers"

export const metadata: Metadata = {
  metadataBase: new URL("https://base-post-booster.vercel.app"),
  title: "Base Post Booster",
  description: "Boost your Base posts instantly 🚀",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {

  const embedConfig = {
    version: "1",
    imageUrl: "https://base-post-booster.vercel.app/og.png",
    button: {
      title: "Open App 🚀",
      action: {
        type: "launch_frame",
        name: "Base Post Booster",
        splashImageUrl:
          "https://base-post-booster.vercel.app/og.png",
        splashBackgroundColor: "#000000",
      },
    },
  }

  return (
    <html lang="en">
      <head>

        {/* ✅ KEEP YOUR MINIAPP CONFIG (NO CHANGE) */}
        <meta
          name="fc:miniapp"
          content={JSON.stringify(embedConfig)}
        />

        {/* ✅ FIXED FRAME METADATA (IMPORTANT) */}
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://base-post-booster.vercel.app/og.png"
        />
        <meta
          property="fc:frame:button:1"
          content="Open App 🚀"
        />
        <meta
          property="fc:frame:button:1:action"
          content="link"
        />
        <meta
          property="fc:frame:button:1:target"
          content="https://base-post-booster.vercel.app"
        />
        <meta
          property="fc:frame:post_url"
          content="https://base-post-booster.vercel.app/api/frame"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </head>

      <body>

        <Providers>
          <ClientInit />
          {children}
        </Providers>

      </body>
    </html>
  )
}
