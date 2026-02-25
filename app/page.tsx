"use client"

import { useState } from "react"
import { useAccount, useSendTransaction } from "wagmi"

export default function Home() {
  const { address, isConnected } = useAccount()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const { sendTransactionAsync, status } = useSendTransaction({
    // Example: replace with your actual tx args
    request: {
      to: "0x0000000000000000000000000000000000000000",
      value: 0
    }
  })

  const handleSend = async () => {
    try {
      setLoading(true)
      const tx = await sendTransactionAsync?.()
      await tx.wait()
      alert("Transaction sent 🚀")
    } catch (e) {
      console.error(e)
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      <button onClick={handleSend} disabled={status === "loading" || loading}>
        Send 🚀
      </button>
    </div>
  )
}
