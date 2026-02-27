"use client"

import { useEffect, useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Line } from "react-chartjs-2"
import Link from "next/link"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

const MINI_APP_LINK = "https://base-post-booster.vercel.app/"

export default function Trending() {
  const [boostedPosts, setBoostedPosts] = useState<any[]>([])
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("boosted_posts")
          .select("*")
          .order("updated_at", { ascending: false })

        if (error) {
          console.error("Supabase fetch error:", error)
          const stored = JSON.parse(localStorage.getItem("boostedPosts") || "[]")
          setBoostedPosts(stored)
        } else {
          setBoostedPosts(data || [])
        }
      } catch (err) {
        console.error("Fetch failed:", err)
        const stored = JSON.parse(localStorage.getItem("boostedPosts") || "[]")
        setBoostedPosts(stored)
      }
    }
    fetchPosts()
  }, [])

  function handleShare(postLink: string) {
    const shareText = `Check this boosted post: ${postLink} via ${MINI_APP_LINK}`
    if (navigator.share) {
      navigator.share({ text: shareText, url: MINI_APP_LINK, title: "Base Post Booster" })
    } else {
      alert("Share fallback: " + shareText)
    }
  }

  // Prepare chart data for selected post
  const chartData = selectedPost
    ? {
        labels: [selectedPost.updated_at], // single point for demo
        datasets: [
          {
            label: selectedPost.post + " ($UrMom)",
            data: [selectedPost.boost_count],
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            tension: 0.4
          }
        ]
      }
    : null

  return (
    <main style={{ padding: 20, textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
      {!selectedPost ? (
        <>
          <h1 style={{ fontSize: 28, marginBottom: 30 }}>Trending Boosted Posts</h1>

          {boostedPosts.length === 0 ? (
            <p>No boosted posts yet</p>
          ) : (
            boostedPosts.map((post, i) => (
              <div
                key={i}
                style={{ border: "1px solid gray", padding: 15, marginBottom: 15, cursor: "pointer" }}
                onClick={() => setSelectedPost(post)}
              >
                <p><strong>Post:</strong> {post.post}</p>
                <p><strong>Contract:</strong> {post.contract || "-"}</p>
                <p><strong>Tier:</strong> {post.tier}</p>
                <p><strong>Boost Count:</strong> {post.boost_count}</p>
                <p><strong>Time:</strong> {new Date(post.updated_at).toLocaleString()}</p>
                <button onClick={(e) => { e.stopPropagation(); handleShare(post.post) }} style={{ marginTop: 10, cursor: "pointer" }}>
                  Share
                </button>
              </div>
            ))
          )}
        </>
      ) : (
        <>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Post Chart: {selectedPost.post}</h2>
          {chartData && <Line data={chartData} />}
          <div style={{ marginTop: 20 }}>
            <button onClick={() => setSelectedPost(null)} style={{ padding: "10px 20px", cursor: "pointer" }}>
              Back to Trending
            </button>
          </div>
        </>
      )}
    </main>
  )
}
