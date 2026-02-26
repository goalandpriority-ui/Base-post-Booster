"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Trending() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("boosted_posts").select("*").order("boost_count", { ascending: false })
      setPosts(data || [])
    }
    fetchPosts()
  }, [])

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Trending Boosted Posts</h1>

      <div style={{ marginBottom: 20 }}>
        <a href="/">Back to Boost</a>
      </div>

      {posts.length === 0 && <p>No boosted posts yet.</p>}

      {posts.map((post, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: 20, marginTop: 20 }}>
          <h3>#{index + 1}</h3>
          <p><strong>Boost Count:</strong> {post.boost_count}</p>
          <p><strong>Tier:</strong> {post.tier}</p>
          <p><strong>Post:</strong> <a href={post.post_link} target="_blank">{post.post_link}</a></p>
          {post.contract && <iframe src={`https://dexscreener.com/base/${post.contract}`} width="100%" height="500" style={{ border: "none", marginTop: 10 }} />}
        </div>
      ))}
    </main>
  )
}
