"use client"

import { useEffect, useState } from "react"

type Post = {
  id: number
  content: string
  boost_count: number
}

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts")
      const data = await res.json()

      // Sort by boost_count DESC
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

  // Initial load
  useEffect(() => {
    fetchPosts()
  }, [])

  // ⚡ Real-time auto refresh every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading trending posts...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        🔥 Trending Boosted Posts
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
                className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg">{post.content}</p>

                  <div className="flex gap-2 mt-2 items-center">
                    {/* 🥇🥈🥉 Top 3 Badges */}
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

                    {/* 🔥 HOT badge */}
                    {isHot && (
                      <span className="px-2 py-1 text-xs bg-red-600 rounded-full font-bold">
                        🔥 HOT
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">Boosts</p>
                  <p className="text-xl font-bold">
                    {post.boost_count}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
