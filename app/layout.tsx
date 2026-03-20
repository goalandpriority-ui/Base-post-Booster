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

        {/* ✅ ONLY MINIAPP META (NO FRAME META) */}
        <meta
          name="fc:miniapp"
          content={JSON.stringify(embedConfig)}
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
