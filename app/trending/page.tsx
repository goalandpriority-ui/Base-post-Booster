"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Post = {
  id: number
  content: string
  boost_count: number
}

const MINIAPP_URL = "https://base-post-booster.vercel.app"

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts")
      const data = await res.json()

      const sorted = data.sort(
        (a: Post, b: Post) => b.boost_count - a.boost_count
      )

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
    const interval = setInterval(() => {
      fetchPosts()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleShare = async (post: Post) => {
    const shareUrl = `${MINIAPP_URL}/trending`

    const shareData = {
      title: "Trending Boosted Post",
      text: post.content,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(
          `${post.content}\n\n${shareUrl}`
        )
        alert("Miniapp link copied!")
      }
    } catch (err) {
      console.error("Share failed:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading trending posts...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Trending Boosted Posts
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">No boosted posts yet</p>
      ) : (
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {posts.map((post, index) => {
              const isHot = post.boost_count > 5

              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className={`relative p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center overflow-hidden hover:scale-[1.02] transition-all
                  ${
                    index === 0
                      ? "ring-2 ring-yellow-400 shadow-lg shadow-yellow-500/20"
                      : ""
                  }`}
                >
                  {/* 🔥 BIG BACKGROUND RANK NUMBER */}
                  <div className="absolute right-6 text-[100px] font-extrabold text-white/5 select-none pointer-events-none">
                    #{index + 1}
                  </div>

                  {/* 👑 Crown for #1 */}
                  {index === 0 && (
                    <div className="absolute -top-4 left-4 text-3xl crown-animate crown-glow">
                      👑
                    </div>
                  )}

                  {/* LEFT CONTENT */}
                  <div className="relative z-10 max-w-[70%]">
                    <p className="text-lg font-medium">
                      {post.content}
                    </p>

                    <div className="flex gap-2 mt-3 items-center flex-wrap">
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
                          HOT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT SIDE BOOST + SHARE */}
                  <div className="relative z-10 text-right space-y-2">
                    <div>
                      <p className="text-sm text-gray-400">Boosts</p>
                      <p className="text-2xl font-bold">
                        {post.boost_count}
                      </p>
                    </div>

                    <button
                      onClick={() => handleShare(post)}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg transition"
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
