"use client"

import { useAccount, useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import { useState } from "react"

export default function Home() {
  const { address, isConnected } = useAccount()
  const { sendTransactionAsync, isPending } = useSendTransaction()

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleBoost() {
    if (!isConnected) {
      alert("Connect wallet first")
      return
    }

    if (!url) {
      alert("Paste post URL")
      return
    }

    try {
      setLoading(true)

      // 🔥 Send ETH on Base
      const txHash = await sendTransactionAsync({
        to: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS as `0x${string}`,
        value: parseEther("0.001")
      })

      // 🔥 Save to database
      await fetch("/api/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          postUrl: url,
          txHash: txHash,
          amount: 0.001
        })
      })

      alert("Boost successful 🚀")
      setUrl("")
    } catch (err) {
      console.error(err)
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-4xl font-bold">Base Post Booster 🚀</h1>

      <input
        type="text"
        placeholder="Paste post URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-3 w-full max-w-md rounded"
      />

      <button
        onClick={handleBoost}
        disabled={loading || isPending}
        className="bg-blue-600 text-white px-6 py-3 rounded w-full max-w-md"
      >
        {loading ? "Processing..." : "Boost Now 🚀"}
      </button>

      {isConnected && (
        <p className="text-sm text-gray-500">
          Connected: {address}
        </p>
      )}
    </div>
  )
}
