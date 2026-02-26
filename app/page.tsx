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
  const [loading, setLoading] = useState(false)

  const tiers = [
    {
      name: "Basic",
      eth: "0.001",
      value: "0x38D7EA4C68000", // 0.001 ETH
      duration: "24 Hours Boost",
      desc: "Starter visibility push",
    },
    {
      name: "Pro",
      eth: "0.003",
      value: "0xAA87BEE538000", // 0.003 ETH
      duration: "48 Hours Boost",
      desc: "High reach promotion",
    },
    {
      name: "Elite",
      eth: "0.005",
      value: "0x11C37937E08000", // 0.005 ETH
      duration: "72 Hours Boost",
      desc: "Maximum exposure",
    },
  ]

  async function handleBoost() {
    if (!postLink) {
      alert("Please paste your Farcaster post link")
      return
    }

    if (!window.ethereum) {
      alert("Please install MetaMask")
      return
    }

    try {
      setLoading(true)

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const selected = tiers[selectedTier]

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2", // 🔥 REPLACE THIS
            value: selected.value,
          },
        ],
      })

      // ✅ Share Content
      const shareText = encodeURIComponent(
        `🚀 Boosted this post with Base Post Booster!

👉 ${postLink}

Built on Base ⚡

Boost yours:
https://yourappurl.com

#Base #Farcaster`
      )

      window.open(
        `https://warpcast.com/~/compose?text=${shareText}`,
        "_blank"
      )

      alert("Boost successful 🚀")
      setPostLink("")
    } catch (err) {
      console.error(err)
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: 10 }}>🚀 Base Post Booster</h1>
      <p style={{ marginBottom: 40, color: "gray" }}>
        Boost your Farcaster post visibility on Base
      </p>

      {/* Tier Cards */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 40,
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
              borderRadius: 12,
              padding: 20,
              width: 200,
              cursor: "pointer",
              transition: "0.2s",
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

      {/* Post URL */}
      <p style={{ fontWeight: "bold", marginBottom: 8 }}>
        Post URL
      </p>

      <input
        type="text"
        placeholder="Paste your Farcaster post link..."
        value={postLink}
        onChange={(e) => setPostLink(e.target.value)}
        style={{
          padding: 12,
          width: "100%",
          maxWidth: 420,
          marginBottom: 30,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      {/* Boost Button */}
      <button
        onClick={handleBoost}
        disabled={loading}
        style={{
          padding: "12px 30px",
          borderRadius: 8,
          border: "2px solid black",
          background: loading ? "#eee" : "white",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Processing..." : "Boost Now"}
      </button>
    </main>
  )
}
