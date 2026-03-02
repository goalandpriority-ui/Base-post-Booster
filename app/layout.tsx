// app/layout.tsx – updated version (your existing + SDK)
"use client";  // Add this at top if not there (for useEffect)

import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { useEffect } from "react";  // Add this
import { sdk } from "@farcaster/miniapp-sdk";  // Add this import

export const metadata: Metadata = {
  // your existing metadata (title, og, etc.)
  metadataBase: new URL("https://base-post-booster.vercel.app"),
  title: "Base Post Booster",
  description: "Boost your Base posts instantly 🚀",
  openGraph: {
    // ...
  },
  twitter: {
    // ...
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // MUST call this to hide splash and show app content
    sdk.actions.ready();
    // Optional: Debug context
    // sdk.context.then(ctx => console.log("Farcaster context:", ctx));
  }, []);  // Run once

  const embedConfig = {
    version: "1",
    imageUrl: "https://base-post-booster.vercel.app/og.png",
    button: {
      title: "Open App 🚀",
      action: {
        type: "launch_frame",
        name: "Base Post Booster",
        splashImageUrl: "https://base-post-booster.vercel.app/og.png",
        splashBackgroundColor: "#000000",
      },
    },
  };

  return (
    <html lang="en">
      <head>
        <meta name="fc:miniapp" content={JSON.stringify(embedConfig)} />
        {/* optional backup */}
        <meta name="fc:frame" content={JSON.stringify(embedConfig)} />
      </head>
      <body>{children}</body>
    </html>
  );
}
