"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

type Post = {
  id: number
  content: string
  boost_count: number
  contract?: string
}

const MINIAPP_URL = "https://base-post-booster.vercel.app"

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newIds, setNewIds] = useState<number[]>([])
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
      <div style={{
        minHeight: "100vh",
        background: "#E3A6AE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
      }}>
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
              borderRadius: 8
            }}
          >
            Boost Now
          </Link>
        </div>
      ) : (
        <motion.div layout style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

// --------------------
// Post Card Component
// --------------------
function PostCard({ post }: { post: Post }) {
  const [showChart, setShowChart] = useState(false)
  const MINIAPP_URL = "https://base-post-booster.vercel.app"

  const handleShare = async () => {
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        color: "black",
      }}
    >
      <p style={{ fontSize: 16, fontWeight: "500" }}>{post.content}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 12 }}>Boosts</p>
          <p style={{ fontSize: 20, fontWeight: "bold" }}>{post.boost_count}</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleShare}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              background: "#38bdf8",
              color: "black",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Share
          </button>

          {post.contract && (
            <button
              onClick={() => setShowChart(!showChart)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: "#22c55e",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {showChart ? "Hide Chart" : "View Chart"}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showChart && post.contract && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 300, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", marginTop: 10, borderRadius: 8 }}
          >
            <iframe
              src={`https://dexscreener.com/base/${post.contract}?embed=1&theme=light`}
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "8px" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
