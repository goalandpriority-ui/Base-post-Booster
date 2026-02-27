// app/trending/page.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import dynamic from "next/dynamic"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Dynamic chart import to avoid SSR issues
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

export default function Trending() {
  const [boostedPosts, setBoostedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  function handleShare(postLink: string) {
    const MINI_APP_LINK = "https://base-post-booster.vercel.app/"
    const shareText = `Check this boosted post: ${postLink} via ${MINI_APP_LINK}`
    if (navigator.share) navigator.share({ text: shareText, url: MINI_APP_LINK, title: "Base Post Booster" })
    else toast.success(`Share link copied: ${shareText}`)
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />

      {/* Header with Back button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Trending Boosted Posts</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : boostedPosts.length === 0 ? (
        <p className="text-gray-500 text-center">No boosted posts yet</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {boostedPosts.map((post, i) => {
            const chartData = {
              labels: ["Jan", "Feb", "Mar", "Apr", "May"],
              datasets: [
                {
                  label: post.tier ? `$${post.tier} Price` : "$UrMom Price",
                  data: [10, 20, 15, 25, 30],
                  borderColor: "rgba(34,197,94,1)",
                  backgroundColor: "rgba(34,197,94,0.2)",
                  tension: 0.4,
                  fill: true,
                },
              ],
            }

            return (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                <p className="font-semibold text-lg mb-1">Post:</p>
                <p className="mb-2">{post.post}</p>

                <p className="text-sm text-gray-500">Contract: {post.contract || "-"}</p>
                <p className="text-sm text-gray-500">Tier: {post.tier}</p>
                <p className="text-sm text-gray-500">Boost Count: {post.boost_count}</p>
                <p className="text-sm text-gray-400 mb-4">{new Date(post.updated_at).toLocaleString()}</p>

                {/* Chart */}
                <div className="mt-4">
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top", labels: { color: "#111", font: { size: 14 } } },
                        title: { display: true, text: "Boosted Coin Chart", color: "#111", font: { size: 16 } },
                        tooltip: { backgroundColor: "#111", titleColor: "#fff", bodyColor: "#fff" },
                      },
                    }}
                  />
                </div>

                <button
                  onClick={() => handleShare(post.post)}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
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
