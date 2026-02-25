"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useContractWrite } from "wagmi"
import { useNetwork as useWagmiNetwork, useSwitchNetwork as useWagmiSwitchNetwork } from "wagmi"
import BasePostBoosterABI from "../abi/BasePostBoosterABI.json"

const tiers = [
  { name: "Basic", description: "Small boost", durations: [{ label: "1h", price: 0.001 }, { label: "6h", price: 0.002 }, { label: "24h", price: 0.003 }] },
  { name: "Whale", description: "Medium boost", durations: [{ label: "1h", price: 0.002 }, { label: "6h", price: 0.004 }, { label: "24h", price: 0.006 }] },
  { name: "Pro", description: "High boost", durations: [{ label: "1h", price: 0.003 }, { label: "6h", price: 0.006 }, { label: "24h", price: 0.009 }] },
]

const BASE_CHAIN_ID = 8453

export default function BoostForm() {
  const [postUrl, setPostUrl] = useState("")
  const [tierIndex, setTierIndex] = useState(0)
  const [durationIndex, setDurationIndex] = useState(0)

  const { chain } = useWagmiNetwork()
  const { switchNetwork } = useWagmiSwitchNetwork()

  useEffect(() => {
    if (chain?.id !== BASE_CHAIN_ID && switchNetwork) {
      alert("Switching wallet to Base Network for low fees")
      switchNetwork(BASE_CHAIN_ID)
    }
  }, [chain, switchNetwork])

  const selectedTier = tiers[tierIndex]
  const selectedDuration = selectedTier.durations[durationIndex]

  const { write } = useContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: BasePostBoosterABI,
    functionName: "boostPost",
    args: [postUrl, tierIndex, durationIndex],
    overrides: { value: ethers.utils.parseEther(selectedDuration.price.toString()) },
    enabled: chain?.id === BASE_CHAIN_ID
  })

  const handleBoost = async () => {
    if (!postUrl) return alert("Enter post URL")
    if (chain?.id !== BASE_CHAIN_ID) return alert("Switch wallet to Base Network")
    try {
      await write?.()
      await fetch("/api/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: (await window.ethereum.request({ method: "eth_accounts" }))[0],
          postUrl,
          txHash: "pending",
          amount: selectedDuration.price
        })
      })
      alert("Boost sent 🚀")
      setPostUrl("")
    } catch (e) {
      console.error(e)
      alert("Transaction failed")
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Base Post Booster 🚀</h2>

      <input
        placeholder="Post URL"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      />

      <div style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
        {tiers.map((t, i) => (
          <div
            key={i}
            onClick={() => { setTierIndex(i); setDurationIndex(0) }}
            style={{
              flex: 1,
              padding: "10px",
              border: tierIndex === i ? "2px solid #4f46e5" : "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <h4>{t.name}</h4>
            <p style={{ fontSize: "12px" }}>{t.description}</p>
            <ul style={{ fontSize: "12px" }}>
              {t.durations.map((d, idx) => (
                <li key={idx}>{d.label} – {d.price} ETH</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <select
        value={durationIndex}
        onChange={(e) => setDurationIndex(Number(e.target.value))}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      >
        {selectedTier.durations.map((d, idx) => (
          <option key={idx} value={idx}>{d.label} – {d.price} ETH</option>
        ))}
      </select>

      <button
        onClick={handleBoost}
        style={{
          width: "100%",
          padding: "12px",
          background: "#4f46e5",
          color: "#fff",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Boost Now 🚀
      </button>
    </div>
  )
            }
