"use client"

import { useEffect, useState } from "react"

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

  // ⚡ Auto refresh every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // 🔁 Share Function (Miniapp link included)
  const handleShare = async (post: Post) => {
    const shareUrl = `${MINIAPP_URL}/trending`

    const shareData = {
      title: "Trending Boosted Post",
      text: `${post.content}`,
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
        <div className="space-y-4">
          {posts.map((post, index) => {
            const isHot = post.boost_count > 5

            return (
              <div
                key={post.id}
                className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center transition-all duration-300 hover:scale-[1.02]"
              >
                <div>
                  <p className="text-lg">{post.content}</p>

                  <div className="flex gap-2 mt-2 items-center flex-wrap">
                    {/* 🥇🥈🥉 Rank Badges */}
                    {index === 0 && (
                      <span className="px-2 py-1 text-xs bg-yellow-500 text-black rounded-full font-bold gold-animate">
                        🥇 Gold
                      </span>
                    )}
                    {index === 1 && (
                      <span className="px-2 py-1 text-xs bg-gray-300 text-black rounded-full font-bold silver-animate">
                        🥈 Silver
                      </span>
                    )}
                    {index === 2 && (
                      <span className="px-2 py-1 text-xs bg-orange-500 text-black rounded-full font-bold bronze-animate">
                        🥉 Bronze
                      </span>
                    )}

                    {/* HOT Badge */}
                    {isHot && (
                      <span className="px-2 py-1 text-xs bg-red-600 rounded-full font-bold hot-animate">
                        HOT
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div>
                    <p className="text-sm text-gray-400">Boosts</p>
                    <p className="text-xl font-bold">
                      {post.boost_count}
                    </p>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(post)}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                  >
                    Share
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
