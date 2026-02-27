"use client"

import { useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import Link from "next/link"

declare global {
  interface Window {
    ethereum?: any
  }
}

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Wallet address where you receive ETH
const YOUR_WALLET_ADDRESS = "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2"
const MINI_APP_LINK = "https://base-post-booster.vercel.app/"

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

      // 🔥 Request wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      // 🔥 Send ETH payment
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: accounts[0],
          to: YOUR_WALLET_ADDRESS,
          value: tiers[selectedTier].value,
        }],
      })

      // 🔥 Check if post already exists
      const { data: existingPost } = await supabase
        .from("boosted_posts")
        .select("*")
        .eq("post", postLink)
        .maybeSingle()

      if (existingPost) {
        // 🔥 Increment boost count
        await supabase
          .from("boosted_posts")
          .update({
            boost_count: existingPost.boost_count + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("post", postLink)

      } else {
        // 🔥 Insert new boosted post
        await supabase
          .from("boosted_posts")
          .insert([{
            post: postLink,
            contract: contract || null,
            tier: tiers[selectedTier].name,
            boost_count: 1,
            updated_at: new Date().toISOString(),
          }])
      }

      // 🔥 Local backup
      let existing: any[] = JSON.parse(localStorage.getItem("boostedPosts") || "[]")
      const index = existing.findIndex(item => item.post === postLink)

      if (index !== -1) {
        existing[index].boost_count += 1
      } else {
        existing.push({
          post: postLink,
          contract,
          tier: tiers[selectedTier].name,
          boost_count: 1,
          updated_at: new Date().toISOString(),
        })
      }

      localStorage.setItem("boostedPosts", JSON.stringify(existing))

      // 🔥 Share
      const shareText = `I just boosted a post! Check it here: ${postLink} via ${MINI_APP_LINK}`

      if (navigator.share) {
        await navigator.share({
          text: shareText,
          url: MINI_APP_LINK,
          title: "Base Post Booster",
        })
      }

      alert("Boost successful 🚀")
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
    <main style={{ padding: 20, textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>Base Post Booster</h1>

      {/* Tier Selection */}
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

      {/* Inputs */}
      <input
        type="text"
        placeholder="Paste Base post link"
        value={postLink}
        onChange={e => setPostLink(e.target.value)}
        style={{ padding: 12, width: "100%", marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Coin Contract Address (optional)"
        value={contract}
        onChange={e => setContract(e.target.value)}
        style={{ padding: 12, width: "100%" }}
      />

      {/* Boost Button */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleBoost}
          disabled={loading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {loading ? "Processing..." : "Boost Now"}
        </button>
      </div>

      {/* Trending Link */}
      <div style={{ marginTop: 40 }}>
        <Link href="/trending">View Trending Posts</Link>
      </div>
    </main>
  )
}
