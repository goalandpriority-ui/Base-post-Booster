"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

type Post = {
  id: number
  content: string
  boost_count: number
  user_avatar?: string
  user_handle?: string
  coin_price?: number
}

const MINIAPP_URL = "https://base-post-booster.vercel.app"

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newIds, setNewIds] = useState<number[]>([])
  const [expandedChart, setExpandedChart] = useState<number | null>(null)
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#E3A6AE",
          color: "black",
        }}
      >
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
          <Link
            href="/"
            style={{
              marginTop: 20,
              display: "inline-block",
              background: "black",
              color: "white",
              padding: "10px 20px",
              borderRadius: 8,
            }}
          >
            Boost Now
          </Link>
        </div>
      ) : (
        <motion.div layout style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <AnimatePresence>
            {posts.map((post, index) => {
              const isNew = newIds.includes(post.id)
              const isExpanded = expandedChart === post.id

              const getTopBadge = () => {
                if (index === 0) return { text: "Gold", color: "#FFD700" }
                if (index === 1) return { text: "Silver", color: "#C0C0C0" }
                if (index === 2) return { text: "Bronze", color: "#CD7F32" }
                return null
              }

              const topBadge = getTopBadge()

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
                    flexDirection: "column",
                    gap: 12,
                    position: "relative",
                  }}
                >
                  {/* Top Badge / Crown */}
                  {topBadge && (
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{
                        position: "absolute",
                        top: -10,
                        left: 10,
                        background: topBadge.color,
                        color: "black",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {topBadge.text} 🏆
                    </motion.div>
                  )}

                  {/* User Avatar + Handle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {post.user_avatar && (
                      <img
                        src={post.user_avatar}
                        alt="avatar"
                        style={{ width: 40, height: 40, borderRadius: "50%" }}
                      />
                    )}
                    <span style={{ fontWeight: "bold" }}>
                      {post.user_handle || "Anonymous"}
                    </span>

                    {isNew && (
                      <span
                        style={{
                          marginLeft: 10,
                          background: "green",
                          color: "black",
                          padding: "2px 6px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Post Content */}
                  <p style={{ maxWidth: "100%" }}>{post.content}</p>

                  {/* Boosts + Share + Coin Price + Expand Chart */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 12 }}>Boosts</p>
                      <p style={{ fontSize: 22, fontWeight: "bold" }}>{post.boost_count}</p>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      {post.coin_price && (
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            padding: "2px 6px",
                            background: "#f0f0f0",
                            borderRadius: 6,
                            cursor: "default",
                          }}
                          title={`Coin Price: $${post.coin_price}`}
                        >
                          ${post.coin_price}
                        </span>
                      )}
                      <button
                        onClick={() => handleShare(post)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: "#38bdf8",
                          border: "none",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Share
                      </button>

                      <button
                        onClick={() => setExpandedChart(isExpanded ? null : post.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: "#fbbf24",
                          border: "none",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {isExpanded ? "Hide Chart" : "View Chart"}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Chart */}
                  {isExpanded && (
                    <div style={{ marginTop: 10, height: 200, background: "#e5e7eb", borderRadius: 8 }}>
                      <iframe
                        src={`https://widget.coinlore.com/coin_price_chart_widget/${post.id}`}
                        style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
                      />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
          }
