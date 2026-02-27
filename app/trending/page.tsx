// app/trending/page.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export default function Trending() {
  const [boostedPosts, setBoostedPosts] = useState<any[]>([])

  // Fetch boosted posts from Supabase on load
  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("boosted_posts")
          .select("*")
          .order("updated_at", { ascending: false })

        if (error) {
          console.error("Supabase fetch error:", error)
          // fallback to localStorage
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

  // Share function for each post
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
    <main style={{ padding: 20, textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>Trending Boosted Posts</h1>

      {boostedPosts.length === 0 ? (
        <p>No boosted posts yet</p>
      ) : (
        boostedPosts.map((post, i) => (
          <div key={i} style={{ border: "1px solid gray", padding: 15, marginBottom: 15 }}>
            <p><strong>Post:</strong> {post.post}</p>
            <p><strong>Contract:</strong> {post.contract || "-"}</p>
            <p><strong>Tier:</strong> {post.tier}</p>
            <p><strong>Boost Count:</strong> {post.boost_count}</p>
            <p><strong>Time:</strong> {new Date(post.updated_at).toLocaleString()}</p>
            <button onClick={() => handleShare(post.post)} style={{ marginTop: 10, cursor: "pointer" }}>
              Share
            </button>
          </div>
        ))
      )}
    </main>
  )
}
