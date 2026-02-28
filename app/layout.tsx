import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Post Booster",
  description: "Boost your Base posts instantly 🚀",

  openGraph: {
    title: "Base Post Booster",
    description: "Boost your Base posts instantly 🚀",
    images: ["https://base-post-booster.vercel.app/og.png"],
  },

  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://base-post-booster.vercel.app/og.png",
    "fc:frame:button:1": "Open App 🚀",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target":
      "https://base-post-booster.vercel.app",
    "fc:frame:post_url":
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
