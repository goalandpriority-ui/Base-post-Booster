import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import ClientInit from "./ClientInit";
import { Providers } from "./providers";

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
        height: 800,
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
        <meta name="fc:frame" content={JSON.stringify(embedConfig)} />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <ClientInit />
      </body>
    </html>
  );
}
