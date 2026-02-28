import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://base-post-booster.vercel.app"),

  title: "Base Post Booster 🚀",
  description: "Boost posts. Climb leaderboard. Go viral on Base 🔥",

  openGraph: {
    title: "Base Post Booster 🚀",
    description: "Boost posts. Climb leaderboard. Go viral on Base 🔥",
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
      <body>{children}</body>
    </html>
  );
}
