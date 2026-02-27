"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

type Post = {
  id: number
  content: string
  boost_count: number
}

const MINIAPP_URL = "https://base-post-booster.vercel.app"

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newIds, setNewIds] = useState<number[]>([])
  const [expandedChartId, setExpandedChartId] = useState<number | null>(null)
  const previousIds = useRef<number[]>([])

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts")
      const data = await res.json()

      const sorted = data.sort((a: Post, b: Post) => b.boost_count - a.boost_count)

      const currentIds = sorted.map((p: Post) => p.id)
      const newlyAdded = currentIds.filter(id => !previousIds.current.includes(id))

      if (previousIds.current.length > 0 && newlyAdded.length > 0) {
        setNewIds(newlyAdded)
        setTimeout(() => setNewIds([]), 3000)
      }

      previousIds.current = currentIds
      setPosts(sorted)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    const interval = setInterval(fetchPosts, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleShare = async (post: Post) => {
    const shareUrl = `${MINIAPP_URL}/trending`
    const shareText = `${post.content}\n\nCheck leaderboard:\n${shareUrl}`

    if (navigator.share) {
      await navigator.share({
        title: "Trending Boosted Post",
        text: post.content,
        url: shareUrl,
      })
    } else {
      await navigator.clipboard.writeText(shareText)
      alert("Miniapp link copied!")
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#E3A6AE", color: "black" }}>
        Loading trending posts...
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#E3A6AE", padding: 30, color: "black" }}>
      <h1 style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
        Trending Boosted Posts
      </h1>

      <div style={{ marginBottom: 30 }}>
        <Link href="/" style={{ fontWeight: "bold", color: "black" }}>
          ← Back to Home
        </Link>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <h2>No boosted posts yet</h2>
          <Link href="/" style={{ marginTop: 20, display: "inline-block", background: "black", color: "white", padding: "10px 20px", borderRadius: 8 }}>
            Boost Now
          </Link>
        </div>
      ) : (
        <motion.div layout style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <AnimatePresence>
            {posts.map((post, index) => {
              const isNew = newIds.includes(post.id)
              const isTop = index < 3

              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {/* Top badges */}
                  {isTop && (
                    <div style={{
                      position: "absolute",
                      top: -10,
                      left: -10,
                      padding: "4px 8px",
                      borderRadius: 8,
                      fontWeight: "bold",
                      background: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                      color: "black"
                    }}>
                      {index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze"}
                    </div>
                  )}

                  {/* NEW badge */}
                  {isNew && (
                    <div style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      padding: "4px 8px",
                      borderRadius: 8,
                      fontWeight: "bold",
                      background: "green",
                      color: "black"
                    }}>
                      NEW
                    </div>
                  )}

                  {/* Post Content */}
                  <p style={{ maxWidth: "60%", fontWeight: "500" }}>{post.content}</p>

                  {/* Right Section */}
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                    <p style={{ fontSize: 12 }}>Boosts</p>
                    <p style={{ fontSize: 22, fontWeight: "bold" }}>{post.boost_count}</p>

                    <div style={{ display: "flex", gap: 5 }}>
                      <button
                        onClick={() => handleShare(post)}
                        style={{ padding: "4px 8px", fontSize: 12, borderRadius: 6, background: "#38bdf8", color: "black", fontWeight: "bold", border: "none", cursor: "pointer" }}
                      >
                        Share
                      </button>

                      <button
                        onClick={() => setExpandedChartId(expandedChartId === post.id ? null : post.id)}
                        style={{ padding: "4px 8px", fontSize: 12, borderRadius: 6, background: "#FACC15", color: "black", fontWeight: "bold", border: "none", cursor: "pointer" }}
                      >
                        {expandedChartId === post.id ? "Hide Chart" : "Show Chart"}
                      </button>
                    </div>

                    {expandedChartId === post.id && (
                      <iframe
                        src={`https://www.tradingview.com/widgetembed/?symbol=COINBASE:BTCUSD&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=F1F3F6&studies=[]&theme=light`}
                        style={{ marginTop: 10, width: 300, height: 200, border: "none", borderRadius: 8 }}
                      />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
                  }
