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
  const [trending, setTrending] = useState<any[]>([])

  const tiers = [
    {
      name: "Basic",
      eth: "0.001",
      value: "0x38D7EA4C68000",
      duration: "24 Hours",
    },
    {
      name: "Pro",
      eth: "0.003",
      value: "0xAA87BEE538000",
      duration: "48 Hours",
    },
    {
      name: "Elite",
      eth: "0.005",
      value: "0x11C37937E08000",
      duration: "72 Hours",
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
            to: "0xYOUR_WALLET_ADDRESS_HERE", // replace
            value: selected.value,
          },
        ],
      })

      // ✅ Add to Trending List
      const newBoost = {
        link: postLink,
        tier: selected.name,
        duration: selected.duration,
        time: new Date().toLocaleString(),
      }

      setTrending([newBoost, ...trending])

      // Share
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
      <h1>🚀 Base Post Booster</h1>

      {/* Tier Selection */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "30px 0",
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
              width: 180,
              cursor: "pointer",
            }}
          >
            <h3>{tier.name}</h3>
            <p>{tier.eth} ETH</p>
            <p style={{ fontSize: 12, color: "gray" }}>
              {tier.duration}
            </p>
          </div>
        ))}
      </div>

      {/* Post Input */}
      <input
        type="text"
        placeholder="Paste Farcaster post link..."
        value={postLink}
        onChange={(e) => setPostLink(e.target.value)}
        style={{
          padding: 12,
          width: "100%",
          maxWidth: 400,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleBoost}
        disabled={loading}
        style={{
          padding: "12px 30px",
          borderRadius: 8,
          border: "2px solid black",
          background: loading ? "#eee" : "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Processing..." : "Boost Now"}
      </button>

      {/* 🔥 Trending Section */}
      {trending.length > 0 && (
        <div style={{ marginTop: 60, width: "100%", maxWidth: 600 }}>
          <h2>🔥 Trending Boosted Posts</h2>

          {trending.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 15,
                marginTop: 15,
                textAlign: "left",
              }}
            >
              <p>
                <strong>Tier:</strong> {item.tier}
              </p>
              <p>
                <strong>Duration:</strong> {item.duration}
              </p>
              <p>
                <strong>Time:</strong> {item.time}
              </p>
              <a
                href={item.link}
                target="_blank"
                style={{ color: "blue" }}
              >
                View Post →
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
