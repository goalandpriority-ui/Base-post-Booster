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

    if (!contract) {
      alert("Enter coin contract address")
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
            contract: contract,
            updated_at: new Date().toISOString(),
          })
          .eq("post", postLink)
      } else {
        await supabase
          .from("boosted_posts")
          .insert([{
            post: postLink,
            contract: contract,
            tier: tiers[selectedTier].name,
            boost_count: 1,
            updated_at: new Date().toISOString(),
          }])
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
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>
        🚀 Base Post Booster
      </h1>

      <div style={{ marginBottom: 30 }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            onClick={() => setSelectedTier(i)}
            style={{
              border: selectedTier === i ? "2px solid #38bdf8" : "1px solid #334155",
              background: "#1e293b",
              padding: 15,
              marginBottom: 15,
              cursor: "pointer",
              borderRadius: 10,
              transition: "0.3s",
            }}
          >
            <h3>{tier.name}</h3>
            <p>{tier.price}</p>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>
              {tier.duration}
            </p>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Paste Base post link"
        value={postLink}
        onChange={e => setPostLink(e.target.value)}
        style={{
          padding: 12,
          width: "100%",
          marginBottom: 10,
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#0f172a",
          color: "white",
        }}
      />

      <input
        type="text"
        placeholder="Coin Contract Address"
        value={contract}
        onChange={e => setContract(e.target.value)}
        style={{
          padding: 12,
          width: "100%",
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#0f172a",
          color: "white",
        }}
      />

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleBoost}
          disabled={loading}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
            background: "#38bdf8",
            border: "none",
            color: "black",
            fontWeight: "bold",
            borderRadius: 8,
            width: "100%",
          }}
        >
          {loading ? "Processing..." : "Boost Now"}
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <Link href="/trending" style={{ color: "#38bdf8" }}>
          View Trending Posts →
        </Link>
      </div>
    </main>
  )
          }
