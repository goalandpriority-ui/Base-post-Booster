"use client"

import { useAccount, useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import { useState } from "react"

export default function Home() {
  const { address } = useAccount()
  const [url, setUrl] = useState("")

  const { sendTransactionAsync } = useSendTransaction()

  async function handleBoost() {
    const tx = await sendTransactionAsync({
      to: "YOUR_WALLET_ADDRESS",
      value: parseEther("0.001")
    })

    await fetch("/api/boost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: address,
        postUrl: url,
        txHash: tx,
        amount: 0.001
      })
    })

    alert("Boost successful 🚀")
  }

  return (
    <div className="flex flex-col gap-4 p-10">
      <h1 className="text-3xl font-bold">Base Post Booster 🚀</h1>

      <input
        placeholder="Paste post URL"
        className="border p-2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={handleBoost}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Boost Now 🚀
      </button>
    </div>
  )
}
