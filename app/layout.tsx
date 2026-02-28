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
        url: "/og.png", // must exist in /public
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

  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://base-post-booster.vercel.app/og.png",
    "fc:frame:button:1": "Open App 🚀",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target":
      "https://base-post-booster.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
