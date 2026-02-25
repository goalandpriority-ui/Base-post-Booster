import WalletProvider from "@/components/WalletProvider"
import { ReactNode } from "react"

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
