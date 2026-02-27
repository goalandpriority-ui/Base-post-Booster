"use client"

import { useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import Link from "next/link"

declare global {
  interface Window {
    ethereum?: any
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

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

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: accounts[0],
          to: YOUR_WALLET_ADDRESS,
          value: tiers[selectedTier].value,
        }],
      })

      const { data: existingPost } = await supabase
        .from("boosted_posts")
        .select("*")
        .eq("post", postLink)
        .maybeSingle()

      if (existingPost) {
        await supabase
          .from("boosted_posts")
          .update({
            boost_count: existingPost.boost_count + 1,
            contract: contract || existingPost.contract,
            updated_at: new Date().toISOString(),
          })
          .eq("post", postLink)
      } else {
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

      alert("Boost successful")
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
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: 20,
        textAlign: "center",
        maxWidth: 500,
        margin: "0 auto",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 30, marginBottom: 30, fontWeight: "bold" }}>
        Base Post Booster
      </h1>

      {/* Tiers */}
      <div style={{ marginBottom: 30 }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            onClick={() => setSelectedTier(i)}
            style={{
              border: selectedTier === i ? "2px solid #38bdf8" : "1px solid #334155",
              background: selectedTier === i ? "#1e293b" : "#0f172a",
              padding: 16,
              marginBottom: 15,
              cursor: "pointer",
              borderRadius: 12,
              transition: "0.3s",
            }}
          >
            <h3 style={{ marginBottom: 5 }}>{tier.name}</h3>
            <p style={{ fontWeight: "bold" }}>{tier.price}</p>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>
              {tier.duration}
            </p>
          </div>
        ))}
      </div>

      {/* Post Link */}
      <input
        type="text"
        placeholder="Paste Base post link"
        value={postLink}
        onChange={e => setPostLink(e.target.value)}
        style={inputStyle}
      />

      {/* Optional Contract */}
      <input
        type="text"
        placeholder="Coin Contract Address (Optional)"
        value={contract}
        onChange={e => setContract(e.target.value)}
        style={{ ...inputStyle, marginTop: 10 }}
      />

      {/* Button */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleBoost}
          disabled={loading}
          style={{
            padding: "14px 20px",
            cursor: "pointer",
            background: "#38bdf8",
            border: "none",
            color: "black",
            fontWeight: "bold",
            borderRadius: 10,
            width: "100%",
            fontSize: 16,
          }}
        >
          {loading ? "Processing..." : "Boost Now"}
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <Link href="/trending" style={{ color: "#38bdf8", fontWeight: "bold" }}>
          View Trending Posts →
        </Link>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  padding: 12,
  width: "100%",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
}
