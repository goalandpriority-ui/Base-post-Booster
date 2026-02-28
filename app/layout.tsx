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

        {/* Open Frames v2 (IMPORTANT) */}
        <meta property="of:version" content="vNext" />
        <meta
          property="of:image"
          content="https://base-post-booster.vercel.app/og.png"
        />
        <meta property="of:button:1" content="Open App 🚀" />
        <meta property="of:button:1:action" content="link" />
        <meta
          property="of:button:1:target"
          content="https://base-post-booster.vercel.app"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
