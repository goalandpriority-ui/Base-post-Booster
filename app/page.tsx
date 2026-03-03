"use client"

import { useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import Link from "next/link"
import { useAccount, useConnect, useSendTransaction } from "wagmi"
import { parseEther } from "viem"

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
  const [lastBoost, setLastBoost] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  // ✅ FIXED FOR WAGMI V2
  const { sendTransactionAsync } = useSendTransaction()

  const tiers = [
    { name: "Basic", price: "0.001 ETH", duration: "24 Hours Boost", value: parseEther("0.001") },
    { name: "Pro", price: "0.003 ETH", duration: "48 Hours Boost", value: parseEther("0.003") },
    { name: "Elite", price: "0.005 ETH", duration: "72 Hours Boost", value: parseEther("0.005") },
  ]

  async function handleBoost() {
    if (!postLink) {
      alert("Paste post link")
      return
    }

    if (!isConnected) {
      const injectedConnector = connectors.find(
        (connector) => connector.id === "injected"
      )

      if (injectedConnector) {
        await connect({ connector: injectedConnector })
      } else {
        alert("No wallet found")
      }
      return
    }

    try {
      setLoading(true)

      // ✅ Correct wagmi v2 transaction
      const txHash = await sendTransactionAsync({
        to: YOUR_WALLET_ADDRESS as `0x${string}`,
        value: tiers[selectedTier].value,
      })

      // ✅ SAVE TO DATABASE
      await fetch("/api/save-boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          postUrl: postLink,
          contract: contract,
          txHash: txHash,
          amount: Number(tiers[selectedTier].value) / 1e18,
        }),
      })

      alert(`Boost successful! Tx hash: ${txHash}`)

      setLastBoost(postLink)
      setPostLink("")
      setContract("")
    } catch (err: any) {
      console.error(err)
      alert("Transaction failed: " + (err.shortMessage || err.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#E3A6AE",
        padding: 20,
        textAlign: "center",
        maxWidth: 500,
        margin: "0 auto",
        color: "black",
      }}
    >
      <h1
        style={{
          fontSize: 30,
          marginBottom: 30,
          fontWeight: "bold",
          color: "#ffffff",
          background: "#3b82f6",
          padding: "10px 20px",
          borderRadius: 12,
        }}
      >
        Base Post Booster
      </h1>

      {/* Tiers */}
      <div style={{ marginBottom: 30 }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            onClick={() => setSelectedTier(i)}
            style={{
              border: selectedTier === i ? "2px solid black" : "1px solid #999",
              background: selectedTier === i ? "#ffffff" : "#f5f5f5",
              padding: 16,
              marginBottom: 15,
              cursor: "pointer",
              borderRadius: 12,
              transition: "0.3s",
            }}
          >
            <h3 style={{ marginBottom: 5 }}>{tier.name}</h3>
            <p style={{ fontWeight: "bold" }}>{tier.price}</p>
            <p style={{ fontSize: 14, color: "#333" }}>{tier.duration}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Paste Base post link"
        value={postLink}
        onChange={(e) => setPostLink(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Coin Contract Address "
        value={contract}
        onChange={(e) => setContract(e.target.value)}
        style={{ ...inputStyle, marginTop: 10 }}
      />

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleBoost}
          disabled={loading}
          style={{
            padding: "14px 20px",
            cursor: "pointer",
            background: "black",
            border: "none",
            color: "white",
            fontWeight: "bold",
            borderRadius: 10,
            width: "100%",
            fontSize: 16,
          }}
        >
          {loading ? "Processing..." : isConnected ? "Boost Now" : "Connect Wallet"}
        </button>
      </div>

      {/* ✅ Share after boost */}
      {lastBoost && (
        <button
          onClick={() => {
            const text = `🚀 My post is boosted on Base Post Booster!

Post: ${lastBoost}

Boost yours 👇
${MINI_APP_LINK}`
            window.open(
              `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`,
              "_blank"
            )
          }}
          style={{
            marginTop: 12,
            padding: 12,
            background: "#38bdf8",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Share on Farcaster 🚀
        </button>
      )}

      {isConnected && (
        <p style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      )}

      <div style={{ marginTop: 40 }}>
        <Link href="/trending" style={{ color: "black", fontWeight: "bold" }}>
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
  border: "1px solid #999",
  background: "#ffffff",
  color: "black",
}
