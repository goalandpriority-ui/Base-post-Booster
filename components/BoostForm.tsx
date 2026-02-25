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

  const handleBoost = async () => {
    if (!address) return alert("Connect wallet first")

    const amount = BOOST_TYPES[tier as keyof typeof BOOST_TYPES]

    const tx = await sendTransactionAsync({
      to: RECEIVER_ADDRESS,
      value: parseEther(amount)
    })

    setTxHash(tx)

    await fetch("/api/boost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postUrl,
        user: address,
        amount,
        tier,
        txHash: tx
      })
    })
  }

  return (
    <div>
      <input
        placeholder="Paste post URL"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
      />

      <select onChange={(e) => setTier(e.target.value)}>
        <option value="starter">Starter 🟢</option>
        <option value="pro">Pro 🔵</option>
        <option value="whale">Whale 🐋</option>
      </select>

      <button onClick={handleBoost}>Boost Now 🚀</button>

      {txHash && <ShareButtons postUrl={postUrl} />}
    </div>
  )
}
