"use client"

import { useState } from "react"
import { useSendTransaction, useWaitForTransaction } from "wagmi"
import { parseEther } from "viem"
import { useWallet } from "../components/WalletProvider"

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const { account } = useWallet()

  const { sendTransaction } = useSendTransaction({
    request: {
      to: "0xRecipientAddressHere", // change to your recipient
      value: parseEther("0.01"),
    },
  })

  const { isLoading: txLoading } = useWaitForTransaction({
    hash: sendTransaction?.hash,
  })

  const handleSend = async () => {
    try {
      setLoading(true)
      const tx = await sendTransaction?.()
      await tx?.wait?.()
      alert("Transaction sent 🚀")
    } catch (e) {
      console.error(e)
      alert("Transaction failed ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1>Base Post Booster</h1>
      <button onClick={handleSend} disabled={loading || txLoading}>
        {loading || txLoading ? "Sending..." : "Send Transaction"}
      </button>
      <p>Connected account: {account ?? "Not connected"}</p>
    </div>
  )
}
