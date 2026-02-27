"use client"

import { useEffect, useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import dynamic from "next/dynamic"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Dynamic chart import
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

// Coin fetch interval
const FETCH_INTERVAL = 10000 // 10 seconds

export default function Trending() {
  const [boostedPosts, setBoostedPosts] = useState<any[]>([])
  const [coinPrices, setCoinPrices] = useState<{ [contract: string]: number[] }>({})
  const [loading, setLoading] = useState(true)

  // Fetch posts from Supabase
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
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Fetch coin prices periodically
  useEffect(() => {
    if (boostedPosts.length === 0) return

    const interval = setInterval(async () => {
      try {
        const newPrices: { [contract: string]: number } = {}
        for (const post of boostedPosts) {
          if (!post.contract) continue
          const res = await axios.get(
            `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${post.contract}&vs_currencies=usd`
          )
          newPrices[post.contract] = res.data[post.contract.toLowerCase()]?.usd || 0
        }

        setCoinPrices(prev => {
          const updated: { [contract: string]: number[] } = { ...prev }
          for (const contract in newPrices) {
            if (!updated[contract]) updated[contract] = []
            updated[contract].push(newPrices[contract])
            if (updated[contract].length > 10) updated[contract].shift()
          }
          return updated
        })
      } catch (err) {
        console.error("Coin fetch error:", err)
      }
    }, FETCH_INTERVAL)

    return () => clearInterval(interval)
  }, [boostedPosts])

  // Share post
  function handleShare(postLink: string) {
    const MINI_APP_LINK = "https://base-post-booster.vercel.app/"
    const shareText = `Check this boosted post: ${postLink} via ${MINI_APP_LINK}`
    if (navigator.share) navigator.share({ text: shareText, url: MINI_APP_LINK, title: "Base Post Booster" })
    else toast.success(`Share link copied: ${shareText}`)
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Trending Boosted Posts</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : boostedPosts.length === 0 ? (
        <p className="text-gray-500">No boosted posts yet</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {boostedPosts.map((post, i) => {
            const prices = coinPrices[post.contract!] || []
            const chartData = {
              labels: prices.map((_, idx) => `T-${prices.length - idx}`),
              datasets: [
                {
                  label: post.tier ? `$${post.tier} Price` : "$Coin Price",
                  data: prices,
                  borderColor: "rgba(75,192,192,1)",
                  backgroundColor: "rgba(75,192,192,0.2)",
                  tension: 0.3,
                },
              ],
            }

            return (
              <div key={i} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <p><strong>Post:</strong> {post.post}</p>
                <p><strong>Contract:</strong> {post.contract || "-"}</p>
                <p><strong>Tier:</strong> {post.tier}</p>
                <p><strong>Boost Count:</strong> {post.boost_count}</p>
                <p><strong>Time:</strong> {new Date(post.updated_at).toLocaleString()}</p>

                <div className="mt-4">
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "Live Coin Chart" },
                      },
                    }}
                  />
                </div>

                <button
                  onClick={() => handleShare(post.post)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Share
                </button>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
