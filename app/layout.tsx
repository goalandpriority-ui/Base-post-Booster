import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import ClientInit from "./ClientInit"; // Splash screen hide ku
import { Providers } from "./providers"; // wagmi wallet config wrap ku (new file)

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
        height: 800, // 3:2 ratio better for preview card
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
        {/* Farcaster Mini App embed meta – preview card ku */}
        <meta name="fc:miniapp" content={JSON.stringify(embedConfig)} />
        {/* Legacy support optional */}
        <meta name="fc:frame" content={JSON.stringify(embedConfig)} />
      </head>
      <body>
        {/* wagmi + query provider wrap – wallet connect ku important */}
        <Providers>
          {children}
        </Providers>

        {/* Farcaster splash hide pannum component */}
        <ClientInit />
      </body>
    </html>
  );
}
