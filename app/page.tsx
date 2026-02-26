"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

declare global {
  interface Window {
    ethereum?: any
  }
}

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

  const handleBoost = async () => {
    if (!postLink) return alert("Paste post link")
    if (!window.ethereum) return alert("Install MetaMask")

    try {
      setLoading(true)

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: accounts[0], to: "0xYOUR_WALLET_ADDRESS_HERE", value: tiers[selectedTier].value }],
      })

      // Save to Supabase
      const { data: existing } = await supabase
        .from("boosted_posts")
        .select("*")
        .eq("post_link", postLink)
        .single()

      if (existing) {
        await supabase
          .from("boosted_posts")
          .update({ boost_count: existing.boost_count + 1 })
          .eq("id", existing.id)
      } else {
        await supabase.from("boosted_posts").insert({
          post_link: postLink,
          contract: contract || null,
          tier: tiers[selectedTier].name,
          boost_count: 1,
        })
      }

      // Auto share on Farcaster
      const shareText = `
Boosted this post using Base Post Booster!
👉 ${postLink}
Built on Base ⚡
Check our app: ${process.env.NEXT_PUBLIC_APP_LINK}
#Base #Farcaster
      `.trim()

      // Farcaster share URL
      const fcShareUrl = `https://www.farcaster.xyz/share?text=${encodeURIComponent(shareText)}`
      window.open(fcShareUrl, "_blank")

      alert("Boost & Share successful")
      setPostLink("")
      setContract("")
    } catch (err) {
      console.error(err)
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Base Post Booster</h1>

      {tiers.map((tier, i) => (
        <div key={i} onClick={() => setSelectedTier(i)} style={{
          border: selectedTier === i ? "2px solid black" : "1px solid gray",
          padding: 15, marginBottom: 15, cursor: "pointer"
        }}>
          <h3>{tier.name}</h3>
          <p>{tier.price}</p>
          <p style={{ fontSize: 14, color: "gray" }}>{tier.duration}</p>
        </div>
      ))}

      <input type="text" placeholder="Paste Base post link" value={postLink} onChange={(e) => setPostLink(e.target.value)} style={{ padding: 12, width: "100%", marginBottom: 10 }} />

      <input type="text" placeholder="Coin Contract Address" value={contract} onChange={(e) => setContract(e.target.value)} style={{ padding: 12, width: "100%", marginBottom: 20 }} />

      <button onClick={handleBoost} disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
        {loading ? "Processing..." : "Boost Now & Share"}
      </button>

      <div style={{ marginTop: 30 }}>
        <a href="/trending">View Trending Posts</a>
      </div>
    </main>
  )
}
