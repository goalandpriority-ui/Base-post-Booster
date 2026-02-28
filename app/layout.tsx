import type { Metadata } from "next";
import "./globals.css";
import React from "react";

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
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Required because manifest contains "frame" */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://base-post-booster.vercel.app/og.png" />
        <meta property="fc:frame:button:1" content="Open App 🚀" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://base-post-booster.vercel.app" />
      </head>
      <body>{children}</body>
    </html>
  );
}
