"use client"

import { useEffect, useState } from "react"

export default function Trending() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("boostedPosts") || "[]")
    stored.sort((a: any, b: any) => b.boostCount - a.boostCount)
    setPosts(stored)
  }, [])

  function handleShare(postLink: string) {
    // Farcaster share
    const farcasterShareUrl = `https://www.farcaster.xyz/share?text=${encodeURIComponent(
      `I just boosted a post on Base Post Booster! Check it out: ${postLink}`
    )}`
    window.open(farcasterShareUrl, "_blank")

    // MiniApp link share
    const miniAppLink = `https://your-miniapp-link.com/?post=${encodeURIComponent(postLink)}`
    window.open(miniAppLink, "_blank")
  }

  return (
    <main style={{ padding: 20, textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Trending Boosted Posts</h1>

      <div style={{ marginBottom: 20 }}>
        <a href="/">Back to Boost</a>
      </div>

      {posts.length === 0 && <p>No boosted posts yet.</p>}

      {posts.map((post, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: 20, marginTop: 20 }}>
          <h3>#{index + 1}</h3>
          <p><strong>Boost Count:</strong> {post.boostCount}</p>
          <p><strong>Tier:</strong> {post.tier}</p>
          <p><strong>Time:</strong> {post.time}</p>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => window.open(post.link, "_blank")} style={{ padding: "8px 15px", cursor: "pointer" }}>
              View Post
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => handleShare(post.link)}
              style={{ padding: "8px 15px", cursor: "pointer", marginTop: 5 }}
            >
              Share on Farcaster + MiniApp
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
