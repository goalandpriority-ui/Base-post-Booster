import './globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base Post Booster',
  description: 'Boost your Base posts easily',
  openGraph: {
    title: 'Base Post Booster',
    description: 'Boost your Base posts easily',
    images: ['https://base-post-booster.vercel.app/og.png'],
  },
  other: {
    'fc:frame': '1', // changed from vNext
    'fc:frame:image': 'https://base-post-booster.vercel.app/og.png',
    'fc:frame:button:1': 'Open App',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://base-post-booster.vercel.app/',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
