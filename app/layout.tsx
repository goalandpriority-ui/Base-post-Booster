import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Post Booster",
  description: "Boost your Base posts instantly 🚀",

  openGraph: {
    title: "Base Post Booster",
    description: "Boost your Base posts instantly 🚀",
    images: [
      {
        url: "https://base-post-booster.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Base Post Booster",
    description: "Boost your Base posts instantly 🚀",
    images: ["https://base-post-booster.vercel.app/og.png"],
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
