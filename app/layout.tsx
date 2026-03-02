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
        height: 800,  // Change to 1200x800 if your og.png is 3:2 ratio (recommended over 630)
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
  // Embed JSON – exact spec follow panni
  const embedConfig = {
    version: "1",
    imageUrl: "https://base-post-booster.vercel.app/og.png",  // Must load, 3:2 ratio
    button: {
      title: "Open App 🚀",  // Max 32 chars
      action: {
        type: "launch_frame",  // Required for embed launch
        name: "Base Post Booster",  // Mandatory! App name here
        // url: "https://base-post-booster.vercel.app",  // Optional, defaults to manifest homeUrl
        splashImageUrl: "https://base-post-booster.vercel.app/og.png",  // Or better 200x200 if you have separate
        splashBackgroundColor: "#000000",
      },
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Primary: fc:miniapp meta – this makes "Embed found" work */}
        <meta
          name="fc:miniapp"
          content={JSON.stringify(embedConfig)}
        />

        {/* Backup for legacy/compatibility – add pannita safe */}
        <meta
          name="fc:frame"
          content={JSON.stringify(embedConfig)}
        />

        {/* No need for old URL content meta – remove if any */}
      </head>
      <body>{children}</body>
    </html>
  );
}
