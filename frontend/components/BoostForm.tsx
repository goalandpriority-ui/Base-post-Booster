"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useContractWrite, usePrepareContractWrite, useNetwork, useSwitchNetwork } from "wagmi"
import BasePostBoosterABI from "../abi/BasePostBoosterABI.json"

const BASE_CHAIN_ID = 8453

// Fixed: Basic Tier, 3h duration, 0.003 ETH
const TIER_INDEX = 0
const DURATION_INDEX = 2
const PRICE = 0.003

export default function BoostForm() {
  const [postUrl, setPostUrl] = useState("")

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  // Auto switch wallet to Base Network
  useEffect(() => {
    if (chain?.id !== BASE_CHAIN_ID && switchNetwork) {
      alert("Switching wallet to Base Network for low fees")
      switchNetwork(BASE_CHAIN_ID)
    }
  }, [chain, switchNetwork])

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: BasePostBoosterABI,
    functionName: "boostPost",
    args: [postUrl, TIER_INDEX, DURATION_INDEX],
    overrides: {
      value: ethers.utils.parseEther(PRICE.toString()),
    },
    enabled: chain?.id === BASE_CHAIN_ID,
  })

  const { write } = useContractWrite(config)

  const handleBoost = async () => {
    if (!postUrl) return alert("Enter post URL")
    if (chain?.id !== BASE_CHAIN_ID) return alert("Switch wallet to Base Network")
    try {
      await write?.()
      alert(`Boost sent! 🚀\nCategory: Basic\nDuration: 3h\nPrice: 0.003 ETH`)
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
        Boost Now – Basic 3h – 0.003 ETH 🚀
      </button>
    </div>
  )
}
