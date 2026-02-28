// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Base Post Booster',
  description: 'Boost your Base posts easily',
  openGraph: {
    title: 'Base Post Booster',
    description: 'Boost your Base posts easily',
    images: ['https://base-post-booster.vercel.app/og.png'], // make sure public folder la irukku
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Farcaster Frame Meta Tags */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://base-post-booster.vercel.app/og.png" />
        <meta name="fc:frame:button:1" content="Open App" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://base-post-booster.vercel.app/" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Base Post Booster" />
        <meta property="og:description" content="Boost your Base posts easily" />
        <meta property="og:image" content="https://base-post-booster.vercel.app/og.png" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#E3A6AE",
          color: "black",
          minHeight: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  )
}
