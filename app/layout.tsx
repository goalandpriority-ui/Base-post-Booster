export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  )
}
