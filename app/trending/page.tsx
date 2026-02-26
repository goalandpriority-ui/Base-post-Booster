"use client"

import { useEffect, useState } from "react"

export default function Trending() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("boostedPosts") || "[]")

    // sort by boost count (highest first)
    stored.sort((a: any, b: any) => b.boostCount - a.boostCount)

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

      {posts.length === 0 && (
        <p>No boosted posts yet.</p>
      )}

      {posts.map((post, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginTop: 20,
            maxWidth: 700,
            marginInline: "auto",
          }}
        >
          <h3>#{index + 1}</h3>

          <p>
            <strong>Boost Count:</strong> {post.boostCount}
          </p>

          <p>
            <strong>Tier:</strong> {post.tier}
          </p>

          <p>
            <strong>Time:</strong> {post.time}
          </p>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => window.open(post.link, "_blank")}
              style={{ marginRight: 10 }}
            >
              View Post
            </button>
          </div>

          {/* Show chart only if contract exists */}
          {post.contract && (
            <div style={{ marginTop: 20 }}>
              <iframe
                src={`https://dexscreener.com/base/${post.contract}`}
                width="100%"
                height="500"
                frameBorder="0"
              ></iframe>
            </div>
          )}
        </div>
      ))}
    </main>
  )
}
