"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

type Post = {
  id: string
  content: string
  contract: string
  boost_count: number
}

const MINIAPP_URL = "https://base-post-booster.vercel.app"

export default function TrendingPage() {

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newIds, setNewIds] = useState<string[]>([])
  const [expandedChart, setExpandedChart] = useState<string | null>(null)

  const previousIds = useRef<string[]>([])

  const fetchPosts = async () => {

    try {

      const res = await fetch("/api/posts")

      const data: Post[] = await res.json()

      const sorted = data.sort(
        (a, b) => b.boost_count - a.boost_count
      )

      const currentIds = sorted.map((p) => p.id)

      const newlyAdded = currentIds.filter(
        (id) => !previousIds.current.includes(id)
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

    const shareText = `${post.content}

Check leaderboard:
${shareUrl}`

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
        🔥 Trending Boosted Posts
      </h1>

      <div style={{ marginBottom: 30 }}>
        <Link href="/" style={{ fontWeight: "bold", color: "black" }}>
          ← Back to Home
        </Link>
      </div>

      <motion.div
        layout
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >

        <AnimatePresence>

          {posts.map((post) => {

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
                  border: isNew ? "3px solid #22c55e" : "none",
                  boxShadow: isNew
                    ? "0 0 20px rgba(34,197,94,0.6)"
                    : "none",
                }}
              >

                <p style={{ fontWeight: "bold" }}>
                  {post.content}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between" }}>

                  <div>

                    <p style={{ fontSize: 12 }}>
                      Boosts
                    </p>

                    <motion.p
                      key={post.boost_count}
                      initial={{ scale: 1.4 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                      }}
                    >
                      {post.boost_count}
                    </motion.p>

                  </div>

                  <div style={{ display: "flex", gap: 10 }}>

                    <button
                      onClick={() =>
                        setExpandedChart(
                          isExpanded ? null : post.id
                        )
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

                    <button
                      onClick={() => handleShare(post)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: "#6366f1",
                        color: "white",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Share
                    </button>

                  </div>

                </div>

                {isExpanded && (

                  <div
                    style={{
                      marginTop: 15,
                      height: 450,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "black",
                    }}
                  >

                    <iframe
                      src={`https://dexscreener.com/base/${post.contract}?embed=1&theme=dark`}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    />

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
