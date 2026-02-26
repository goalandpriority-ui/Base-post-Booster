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
    { name: "Basic", value: "0x38D7EA4C68000" },
    { name: "Pro", value: "0xAA87BEE538000" },
    { name: "Elite", value: "0x11C37937E08000" },
  ]

  async function handleBoost() {
    if (!postLink) {
      alert("Paste post link")
      return
    }

    if (!window.ethereum) {
      alert("Install MetaMask")
      return
    }

    try {
      setLoading(true)

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: "0xYOUR_WALLET_ADDRESS_HERE",
            value: tiers[selectedTier].value,
          },
        ],
      })

      // Save to localStorage
      const existing =
        JSON.parse(localStorage.getItem("boostedPosts") || "[]")

      const newPost = {
        link: postLink,
        tier: tiers[selectedTier].name,
        time: new Date().toLocaleString(),
      }

      localStorage.setItem(
        "boostedPosts",
        JSON.stringify([newPost, ...existing])
      )

      alert("Boost successful 🚀")

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

      setPostLink("")
    } catch (err) {
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>🚀 Base Post Booster</h1>

      <div style={{ margin: "20px 0" }}>
        {tiers.map((tier, i) => (
          <button
            key={i}
            onClick={() => setSelectedTier(i)}
            style={{
              margin: 10,
              padding: 10,
              border:
                selectedTier === i
                  ? "2px solid black"
                  : "1px solid gray",
            }}
          >
            {tier.name}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Paste Base post link"
        value={postLink}
        onChange={(e) => setPostLink(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={handleBoost} disabled={loading}>
          {loading ? "Processing..." : "Boost Now"}
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <a href="/trending">🔥 View Trending Posts</a>
      </div>
    </main>
  )
}
