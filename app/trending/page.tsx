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
      const data: Post[] = await res.json()

      const sorted = data.sort(
        (a: Post, b: Post) => b.boost_count - a.boost_count
      )

      const currentIds = sorted.map((p: Post) => p.id)

      const newlyAdded = currentIds.filter((id: number) =>
        !previousIds.current.includes(id)
      )

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
    <div
      style={{
        minHeight: "100vh",
        background: "#E3A6AE",
        padding: 30,
        color: "black",
      }}
    >
      <h1 style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
        Trending Boosted Posts
      </h1>

      <div style={{ marginBottom: 30 }}>
        <Link href="/" style={{ fontWeight: "bold", color: "black" }}>
          ← Back to Home
        </Link>
      </div>

      <motion.div layout style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <AnimatePresence>
          {posts.map((post, index) => {
            const isNew = newIds.includes(post.id)
            const isExpanded = expandedChart === post.id

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
                }}
              >
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

                <p>{post.content}</p>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 12 }}>Boosts</p>
                    <p style={{ fontSize: 22, fontWeight: "bold" }}>
                      {post.boost_count}
                    </p>
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
                        }}
                      >
                        ${post.coin_price}
                      </span>
                    )}

                    <button
                      onClick={() =>
                        setExpandedChart(isExpanded ? null : post.id)
                      }
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

                {isExpanded && (
                  <div
                    style={{
                      marginTop: 10,
                      height: 120,
                      background: "#111",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 10,
                      gap: 4,
                    }}
                  >
                    {/* Simple Boost Growth Chart */}
                    {[...Array(10)].map((_, i) => {
                      const height =
                        (post.boost_count / 10) *
                        (0.5 + Math.random())

                      return (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: `${height}px`,
                            background: "#38bdf8",
                            borderRadius: 4,
                          }}
                        />
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
