"use client"

import { useState } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Home() {
  const [selectedTier, setSelectedTier] = useState(0)
  const [postLink, setPostLink] = useState("")

  const tiers = [
    {
      name: "Basic",
      value: "0x38D7EA4C68000", // 0.001 ETH
      eth: "0.001",
      duration: "24 Hours Boost",
      desc: "Starter visibility push",
    },
    {
      name: "Pro",
      value: "0xAA87BEE538000", // 0.003 ETH
      eth: "0.003",
      duration: "48 Hours Boost",
      desc: "High reach promotion",
    },
    {
      name: "Elite",
      value: "0x11C37937E08000", // 0.005 ETH
      eth: "0.005",
      duration: "72 Hours Boost",
      desc: "Maximum exposure",
    },
  ]

  async function handleBoost() {
    if (!postLink) {
      alert("Please paste your post link")
      return
    }

    if (!window.ethereum) {
      alert("Please install MetaMask")
      return
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const selected = tiers[selectedTier]

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2", // 🔥 replace with your wallet
            value: selected.value,
          },
        ],
      })

      alert("Boost payment sent successfully 🚀")
    } catch (err) {
      console.error(err)
      alert("Transaction failed")
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 30 }}>🚀 Boost Your Post</h1>

      {/* Tier Cards */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 40,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {tiers.map((tier, index) => (
          <div
            key={index}
            onClick={() => setSelectedTier(index)}
            style={{
              border:
                selectedTier === index
                  ? "3px solid black"
                  : "1px solid #ccc",
              padding: 20,
              borderRadius: 12,
              width: 200,
              cursor: "pointer",
              textAlign: "center",
              background:
                selectedTier === index ? "#f5f5f5" : "white",
            }}
          >
            <h3 style={{ marginBottom: 6 }}>{tier.name}</h3>

            <p style={{ fontWeight: "bold", marginBottom: 6 }}>
              {tier.eth} ETH
            </p>

            <p style={{ fontSize: 13, color: "gray", marginBottom: 4 }}>
              {tier.duration}
            </p>

            <p style={{ fontSize: 12, opacity: 0.8 }}>
              {tier.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Post Link Input */}
      <p style={{ fontWeight: "bold", marginBottom: 8 }}>
        Post URL
      </p>

      <input
        type="text"
        placeholder="Paste your post link here..."
        value={postLink}
        onChange={(e) => setPostLink(e.target.value)}
        style={{
          padding: "12px",
          width: "100%",
          maxWidth: 400,
          marginBottom: 30,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      {/* Boost Button */}
      <button
        onClick={handleBoost}
        style={{
          padding: "12px 30px",
          borderRadius: 8,
          border: "2px solid black",
          background: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Boost Now
      </button>
    </main>
  )
}
