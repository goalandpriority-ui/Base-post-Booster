"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

declare global {
  interface Window {
    ethereum?: any
  }
}

// --- Supabase client ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [selectedTier, setSelectedTier] = useState(0)
  const [postLink, setPostLink] = useState("")
  const [contract, setContract] = useState("")
  const [loading, setLoading] = useState(false)

  const tiers = [
    { name: "Basic", price: "0.001 ETH", duration: "24 Hours Boost", value: "0x38D7EA4C68000" },
    { name: "Pro", price: "0.003 ETH", duration: "48 Hours Boost", value: "0xAA87BEE538000" },
    { name: "Elite", price: "0.005 ETH", duration: "72 Hours Boost", value: "0x11C37937E08000" },
  ]

  async function handleBoost() {
    if (!postLink) return alert("Paste post link")
    if (!window.ethereum) return alert("Install MetaMask")

    try {
      setLoading(true)

      // --- ETH Transaction ---
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: accounts[0], to: "0xYOUR_WALLET_ADDRESS_HERE", value: tiers[selectedTier].value }],
      })

      // --- Supabase Insert / Update ---
      const { data, error } = await supabase
        .from("boosted_posts")
        .upsert(
          {
            post_link: postLink,
            contract: contract || null,
            tier: tiers[selectedTier].name,
            boost_count: 1,
          },
          { onConflict: "post_link" }
        )

      if (error) console.error("Supabase upsert error:", error)
      else if (data && data.length) {
        const rpcResult = await supabase.rpc("increment_boost_count", { post: postLink })
        if (rpcResult.error) console.error("RPC increment error:", rpcResult.error)
      }

      // --- LocalStorage backup for trending page ---
      let existing = JSON.parse(localStorage.getItem("boostedPosts") || "[]")
      const index = existing.findIndex((item: any) => item.link === postLink)
      if (index !== -1) existing[index].boostCount += 1
      else
        existing.push({
          link: postLink,
          contract: contract || null,
          tier: tiers[selectedTier].name,
          boostCount: 1,
          time: new Date().toLocaleString(),
        })
      localStorage.setItem("boostedPosts", JSON.stringify(existing))

      alert("Boost successful ✅")

      // --- Auto share with mini app link ---
      const shareText = `I just boosted a post! Check it out on Base Post Booster Mini App: ${window.location.origin}`
      if (navigator.share) {
        await navigator.share({ text: shareText })
      } else {
        console.log("Share text:", shareText)
      }

      setPostLink("")
      setContract("")
    } catch (err) {
      console.error(err)
      alert("Transaction failed ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 20, textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>Base Post Booster</h1>

      <div style={{ marginBottom: 30 }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            onClick={() => setSelectedTier(i)}
            style={{
              border: selectedTier === i ? "2px solid black" : "1px solid gray",
              padding: 15,
              marginBottom: 15,
              cursor: "pointer",
            }}
          >
            <h3>{tier.name}</h3>
            <p>{tier.price}</p>
            <p style={{ fontSize: 14, color: "gray" }}>{tier.duration}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Paste Base post link"
        value={postLink}
        onChange={(e) => setPostLink(e.target.value)}
        style={{ padding: 12, width: "100%", boxSizing: "border-box", marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Coin Contract Address"
        value={contract}
        onChange={(e) => setContract(e.target.value)}
        style={{ padding: 12, width: "100%", boxSizing: "border-box" }}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={handleBoost} disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
          {loading ? "Processing..." : "Boost Now"}
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <a href="/trending">View Trending Posts</a>
      </div>
    </main>
  )
}
