"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

type Post = {
  id: number
  content: string
  boost_count: number
  coin?: string
  user?: string
  avatar?: string
  history?: number[]
}

const MINIAPP_URL = "https://base-post-booster.vercel.app"

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newIds, setNewIds] = useState<number[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const previousIds = useRef<number[]>([])

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts")
      const data = await res.json()

      const sorted = data.sort(
        (a: Post, b: Post) => b.boost_count - a.boost_count
      )

      const currentIds = sorted.map((p: Post) => p.id)
      const newlyAdded = currentIds.filter(
        (id: number) => !previousIds.current.includes(id)
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

  const handleShare = (post: Post) => {
    const shareText = `${post.content}\nCheck leaderboard: ${MINIAPP_URL}`
    navigator.clipboard.writeText(shareText)
    alert("Miniapp link copied!")
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#E3A6AE", display: "flex", alignItems: "center", justifyContent: "center", color: "black" }}>
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
              const isExpanded = expandedId === post.id

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
                    gap: 10,
                    boxShadow: isTop ? "0 0 15px rgba(255,215,0,0.5)" : undefined,
                  }}
                >
                  {/* Top Info Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {post.avatar && <img src={post.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />}
                      <span style={{ fontWeight: "bold" }}>{post.user || "Anon"}</span>
                      {post.coin && (
                        <span title={`Current price: $${(Math.random()*2000).toFixed(2)}`} style={{ marginLeft: 10, fontSize: 12, cursor: "help" }}>
                          {post.coin}
                        </span>
                      )}
                    </div>

                    <button onClick={() => handleShare(post)} style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "#38bdf8", border: "none", cursor: "pointer" }}>
                      Share
                    </button>
                  </div>

                  <p>{post.content}</p>

                  {/* Boost Count */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Boosts: <b>{post.boost_count}</b></span>
                    <button onClick={() => setExpandedId(isExpanded ? null : post.id)} style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "#94a3b8", border: "none", cursor: "pointer" }}>
                      {isExpanded ? "Collapse Chart" : "View Chart"}
                    </button>
                  </div>

                  {/* Expandable Boost Chart */}
                  {isExpanded && post.history && (
                    <div style={{ marginTop: 10, height: 150, background: "#f0f0f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}>
                      {/* Placeholder for chart (replace with chart library later) */}
                      Boost history chart for post {post.id}
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
