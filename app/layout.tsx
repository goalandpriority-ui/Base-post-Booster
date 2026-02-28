import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://base-post-booster.vercel.app"),

  title: "Base Post Booster 🚀",
  description: "Boost posts. Climb leaderboard. Go viral on Base 🔥",

  openGraph: {
    title: "Base Post Booster 🚀",
    description: "Boost posts. Climb leaderboard. Go viral on Base 🔥",
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
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
