import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Basic SEO */}
        <title>Base Post Booster 🚀</title>
        <meta
          name="description"
          content="Boost posts. Climb leaderboard. Go viral on Base 🔥"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Base Post Booster 🚀" />
        <meta
          property="og:description"
          content="Boost posts. Climb leaderboard. Go viral on Base 🔥"
        />
        <meta
          property="og:image"
          content="https://base-post-booster.vercel.app/og.png"
        />
        <meta
          property="og:url"
          content="https://base-post-booster.vercel.app"
        />
        <meta property="og:type" content="website" />

        {/* Farcaster Frame vNext */}
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://base-post-booster.vercel.app/og.png"
        />
        <meta property="fc:frame:button:1" content="Open App 🚀" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta
          property="fc:frame:button:1:target"
          content="https://base-post-booster.vercel.app"
        />
        <meta
          property="fc:frame:post_url"
          content="https://base-post-booster.vercel.app/api/frame"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
