"use client"

import { useEffect, useState } from "react"

export default function Trending() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("boostedPosts") || "[]")
    setPosts(stored)
  }, [])

  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        Trending Boosted Posts
      </h1>

      <div style={{ marginBottom: 20 }}>
        <a href="/">Back to Boost</a>
      </div>

      {posts.length === 0 && <p>No boosted posts yet.</p>}

      {posts.map((post, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginTop: 20,
            maxWidth: 500,
            marginInline: "auto",
          }}
        >
          <p><strong>Tier:</strong> {post.tier}</p>
          <p><strong>Time:</strong> {post.time}</p>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => window.open(post.link, "_blank")}
              style={{ marginRight: 10 }}
            >
              View Post
            </button>

            <button
              onClick={() => window.open(post.link, "_blank")}
            >
              View Chart
            </button>
          </div>
        </div>
      ))}
    </main>
  )
}
