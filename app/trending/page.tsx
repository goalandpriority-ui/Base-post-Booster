"use client"

import { useEffect, useState, useRef } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import dynamic from "next/dynamic"
import Link from "next/link"

// ✅ Dynamically import Line chart to avoid SSR build error
const Line = dynamic(() => import("react-chartjs-2").then(mod => mod.Line), { ssr: false })
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// ✅ CoinGecko API helper
async function fetchCoinPrice(contract: string) {
  try {
    if (!contract) return 0
    // CoinGecko API example for Ethereum contract token
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contract}&vs_currencies=usd`
    )
    const data = await res.json()
    const key = Object.keys(data)[0]
    return data[key]?.usd || 0
  } catch {
    return 0
  }
}

export default function Trending() {
  const [boostedPosts, setBoostedPosts] = useState<any[]>([])
  const chartRefs = useRef<any>({}) // For auto updates

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("boosted_posts")
          .select("*")
          .order("updated_at", { ascending: false })
        if (error) throw error
        setBoostedPosts(data || [])
      } catch {
        const stored = JSON.parse(localStorage.getItem("boostedPosts") || "[]")
        setBoostedPosts(stored)
      }
    }
    fetchPosts()
  }, [])

  // Auto update coin price every 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedPosts = await Promise.all(
        boostedPosts.map(async post => {
          if (post.contract) {
            const price = await fetchCoinPrice(post.contract)
            const now = new Date().toLocaleTimeString()
            const history = post.priceHistory || []
            history.push({ time: now, price })
            return { ...post, priceHistory: history.slice(-10) } // Keep last 10 points
          }
          return post
        })
      )
      setBoostedPosts(updatedPosts)
    }, 10000) // 10s

    return () => clearInterval(interval)
  }, [boostedPosts])

  function handleShare(postLink: string) {
    const MINI_APP_LINK = "https://base-post-booster.vercel.app/"
    const shareText = `Check this boosted post: ${postLink} via ${MINI_APP_LINK}`
    if (navigator.share) {
      navigator.share({ text: shareText, url: MINI_APP_LINK, title: "Base Post Booster" })
    } else {
      alert("Share fallback: " + shareText)
    }
  }

  return (
    <main style={{ padding: 20, textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Trending Boosted Posts</h1>

      {/* ✅ Back button */}
      <div style={{ marginBottom: 20 }}>
        <Link href="/">
          <button style={{ padding: "8px 16px", cursor: "pointer" }}>← Back</button>
        </Link>
      </div>

      {boostedPosts.length === 0 ? (
        <p>No boosted posts yet</p>
      ) : (
        boostedPosts.map((post, i) => {
          const chartData = {
            labels: post.priceHistory?.map((p: any) => p.time) || ["--"],
            datasets: [
              {
                label: "$ Price",
                data: post.priceHistory?.map((p: any) => p.price) || [],
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
              },
            ],
          }

          return (
            <div key={i} style={{ border: "1px solid gray", padding: 15, marginBottom: 30 }}>
              <p><strong>Post:</strong> {post.post}</p>
              <p><strong>Contract:</strong> {post.contract || "-"}</p>
              <p><strong>Tier:</strong> {post.tier}</p>
              <p><strong>Boost Count:</strong> {post.boost_count}</p>
              <p><strong>Time:</strong> {new Date(post.updated_at).toLocaleString()}</p>

              <div style={{ marginTop: 20 }}>
                <Line
                  ref={el => chartRefs.current[i] = el}
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Boosted Coin Chart (Live)" },
                    },
                    animation: false,
                  }}
                />
              </div>

              <button onClick={() => handleShare(post.post)} style={{ marginTop: 10, cursor: "pointer" }}>
                Share
              </button>
            </div>
          )
        })
      )}
    </main>
  )
}
