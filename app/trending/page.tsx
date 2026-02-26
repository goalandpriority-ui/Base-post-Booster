"use client"

import { useEffect, useState } from "react"

export default function Trending() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("boostedPosts") || "[]")

    stored.sort((a: any, b: any) => b.boostCount - a.boostCount)

    setPosts(stored)
  }, [])

  return (
    <main
      style={{
        padding: 20,
        textAlign: "center",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>
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
              style={{ padding: "8px 15px", cursor: "pointer" }}
            >
              View Post
            </button>

            {/* New Share Button */}
            <button
              onClick={() => {
                const shareText = `I just boosted a post on Base Post Booster! Check it out: ${post.link} | Mini App: https://your-miniapp-link.vercel.app`;
                window.open(
                  `https://www.farcaster.xyz/share?text=${encodeURIComponent(
                    shareText
                  )}`,
                  "_blank"
                );
              }}
              style={{
                padding: "8px 15px",
                cursor: "pointer",
                marginLeft: 10,
              }}
            >
              Share
            </button>
          </div>

          {post.contract && (
            <div style={{ marginTop: 20 }}>
              <iframe
                src={`https://dexscreener.com/base/${post.contract}`}
                width="100%"
                height="500"
                style={{ border: "none" }}
              ></iframe>
            </div>
          )}
        </div>
      ))}
    </main>
  )
}
