"use client"

import { useState } from "react"
import { useAccount, useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import { BOOST_TYPES, RECEIVER_ADDRESS } from "@/lib/constants"
import ShareButtons from "./ShareButtons"

export default function BoostForm() {
  const { address } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()

  const [postUrl, setPostUrl] = useState("")
  const [tier, setTier] = useState("starter")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleBoost = async () => {
    try {
      if (!address) {
        alert("Connect wallet first")
        return
      }

      if (!postUrl) {
        alert("Paste post URL")
        return
      }

      setLoading(true)

      const amount = BOOST_TYPES[tier as keyof typeof BOOST_TYPES]

      // ✅ wagmi v2 returns hash directly
      const hash = await sendTransactionAsync({
        to: RECEIVER_ADDRESS,
        value: parseEther(amount),
      })

      setTxHash(hash)

      await fetch("/api/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postUrl,
          user: address,
          amount,
          tier,
          txHash: hash, // ✅ send correct hash
        }),
      })
    } catch (error) {
      console.error(error)
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        placeholder="Paste post URL"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        style={{ padding: 8 }}
      />

      <select
        value={tier}
        onChange={(e) => setTier(e.target.value)}
        style={{ padding: 8 }}
      >
        <option value="starter">Starter 🟢</option>
        <option value="pro">Pro 🔵</option>
        <option value="whale">Whale 🐋</option>
      </select>

      <button
        onClick={handleBoost}
        disabled={loading}
        style={{
          padding: 10,
          background: "black",
          color: "white",
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Processing..." : "Boost Now 🚀"}
      </button>

      {txHash && <ShareButtons postUrl={postUrl} />}
    </div>
  )
}
