"use client"

import { useEffect, useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

// ✅ Chart imports
import dynamic from "next/dynamic"

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

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

export default function Trending() {
  const [boostedPosts, setBoostedPosts] = useState<any[]>([])

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
        // fallback to localStorage
        const stored = JSON.parse(localStorage.getItem("boostedPosts") || "[]")
        setBoostedPosts(stored)
      }
    }
    fetchPosts()
  }, [])

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
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>Trending Boosted Posts</h1>

      {boostedPosts.length === 0 ? (
        <p>No boosted posts yet</p>
      ) : (
        boostedPosts.map((post, i) => {
          // Sample chart data for each post
          const chartData = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [
              {
                label: post.tier ? `$${post.tier} Price` : "$UrMom Price",
                data: [10, 20, 15, 25, 30], // Replace with real coin data later
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

              {/* Chart */}
              <div style={{ marginTop: 20 }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Boosted Coin Chart" },
                    },
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
