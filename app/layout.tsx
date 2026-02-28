import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Post Booster 🚀",
  description: "Boost posts. Climb leaderboard. Go viral on Base 🔥",

  openGraph: {
    title: "Base Post Booster 🚀",
    description: "Boost posts. Climb leaderboard. Go viral on Base 🔥",
    url: "https://base-post-booster.vercel.app",
    siteName: "Base Post Booster",
    images: [
      {
        url: "https://base-post-booster.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  other: {
    "fc:frame": "1",
    "fc:frame:image":
      "https://base-post-booster.vercel.app/og.png",
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
