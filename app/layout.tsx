import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Base Post Booster 🚀</title>
        <meta
          name="description"
          content="Boost posts. Climb leaderboard. Go viral on Base 🔥"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
