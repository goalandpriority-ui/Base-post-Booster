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
            {posts.map((post) => (
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
                }}
              >
                <p style={{ maxWidth: "70%" }}>{post.content}</p>

                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12 }}>Boosts</p>
                  <p style={{ fontSize: 22, fontWeight: "bold" }}>
                    {post.boost_count}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
