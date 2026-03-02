import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://base-post-booster.vercel.app"),
  title: "Base Post Booster",
  description: "Boost your Base posts instantly 🚀",
  openGraph: {
    title: "Base Post Booster",
    description: "Boost your Base posts instantly 🚀",
    url: "https://base-post-booster.vercel.app",
    siteName: "Base Post Booster",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Post Booster",
    description: "Boost your Base posts instantly 🚀",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Correct Farcaster Mini App Embed Meta - This fixes "No embed found" */}
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "1",
            imageUrl: "https://base-post-booster.vercel.app/og.png",
            button: {
              title: "Open App 🚀",
              action: "launch_miniapp",
            },
            // More optional: You can add homeUrl etc. if needed, but manifest handles most
          })}
        />

        {/* Backup/legacy support - optional, but add if embed still issues */}
        {/* <meta
          name="fc:frame"
          content={JSON.stringify({
            version: "vNext",
            imageUrl: "https://base-post-booster.vercel.app/og.png",
            button: {
              title: "Boost Now 🚀",
              action: "launch_miniapp",
              target: "https://base-post-booster.vercel.app",
            },
          })}
        /> */}

        {/* Your old wrong one - REMOVE this */}
        {/* <meta name="fc:miniapp" content="https://base-post-booster.vercel.app/.well-known/farcaster.json" /> */}
      </head>
      <body>{children}</body>
    </html>
  );
}
