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
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchPosts, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleShare = async (post: Post) => {
    const shareUrl = `${MINIAPP_URL}/trending`

    const shareData = {
      title: "Trending Boosted Post",
      text: post.content,
      url: shareUrl,
    }

    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(
        `${post.content}\n\n${shareUrl}`
      )
      alert("Miniapp link copied!")
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
        }}
        className="flex items-center justify-center text-white"
      >
        Loading trending posts...
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
      }}
      className="text-white p-8"
    >
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">
        🔥 Trending Boosted Posts
      </h1>

      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to Home
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-xl font-semibold mb-2">
            No boosted posts yet
          </h2>
          <p className="text-gray-400 mb-6">
            Be the first to boost and appear on leaderboard!
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            🚀 Boost Now
          </Link>
        </div>
      ) : (
        <motion.div layout className="space-y-5">
          <AnimatePresence>
            {posts.map((post, index) => {
              const isNew = newIds.includes(post.id)
              const isHot = post.boost_count > 5

              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className={`relative p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 flex justify-between items-center overflow-hidden hover:scale-[1.02] transition-all
                    ${index === 0 ? "ring-2 ring-yellow-400 shadow-lg shadow-yellow-500/20" : ""}
                    ${isNew ? "ring-2 ring-green-400 shadow-lg shadow-green-500/20" : ""}
                  `}
                >
                  {/* BIG FADED RANK */}
                  <div className="absolute right-6 text-[100px] font-extrabold text-white/5 select-none pointer-events-none">
                    #{index + 1}
                  </div>

                  {/* 👑 Crown */}
                  {index === 0 && (
                    <div className="absolute -top-4 left-4 text-3xl animate-bounce">
                      👑
                    </div>
                  )}

                  {/* NEW Badge */}
                  {isNew && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 px-2 py-1 text-xs bg-green-500 text-black font-bold rounded-full"
                    >
                      NEW
                    </motion.div>
                  )}

                  {/* CONTENT */}
                  <div className="relative z-10 max-w-[70%]">
                    <p className="text-lg font-medium break-words">
                      {post.content}
                    </p>

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs bg-yellow-500 text-black rounded-full font-bold">
                          🥇 Gold
                        </span>
                      )}
                      {index === 1 && (
                        <span className="px-2 py-1 text-xs bg-gray-300 text-black rounded-full font-bold">
                          🥈 Silver
                        </span>
                      )}
                      {index === 2 && (
                        <span className="px-2 py-1 text-xs bg-orange-500 text-black rounded-full font-bold">
                          🥉 Bronze
                        </span>
                      )}
                      {isHot && (
                        <span className="px-2 py-1 text-xs bg-red-600 rounded-full font-bold animate-pulse">
                          🔥 HOT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BOOST + SHARE */}
                  <div className="relative z-10 text-right">
                    <p className="text-sm text-gray-400">Boosts</p>
                    <p className="text-2xl font-bold">
                      {post.boost_count}
                    </p>

                    <button
                      onClick={() => handleShare(post)}
                      className="mt-2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      Share
                    </button>
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
