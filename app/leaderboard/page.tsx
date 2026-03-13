"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type User = {
  wallet: string
  _count: { wallet: number }
  _sum: { amount: number }
}

export default function LeaderboardPage() {

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadLeaderboard = async () => {

    try {

      const res = await fetch("/api/leaderboard")

      const data = await res.json()

      setUsers(data)

      setLoading(false)

    } catch (err) {

      console.error(err)

      setLoading(false)

    }

  }

  useEffect(() => {

    loadLeaderboard()

    const interval = setInterval(loadLeaderboard, 10000)

    return () => clearInterval(interval)

  }, [])

  const getRankIcon = (rank: number) => {

    if (rank === 0) return "🥇"
    if (rank === 1) return "🥈"
    if (rank === 2) return "🥉"

    return `#${rank + 1}`

  }

  if (loading) {

    return (

      <main
        style={{
          minHeight: "100vh",
          background: "#E3A6AE",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading leaderboard...
      </main>

    )

  }

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#E3A6AE",
        padding: 30,
        textAlign: "center",
      }}
    >

      <h1
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 30,
        }}
      >
        🏆 Top Boosters
      </h1>

      {users.map((user, i) => (

        <div
          key={user.wallet}
          style={{
            background: "white",
            padding: 20,
            borderRadius: 12,
            marginBottom: 15,
            boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
          }}
        >

          <h3
            style={{
              fontSize: 20,
              marginBottom: 10
            }}
          >
            {getRankIcon(i)}
          </h3>

          <p
            style={{
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            {user.wallet.slice(0,6)}...
            {user.wallet.slice(-4)}
          </p>

          <p>
            Boosts: {user._count.wallet}
          </p>

          <p
            style={{
              fontWeight: "bold",
              color: "#16a34a"
            }}
          >
            ETH Spent: {user._sum.amount}
          </p>

        </div>

      ))}

      <div style={{ marginTop: 40 }}>

        <Link
          href="/"
          style={{
            fontWeight: "bold",
            fontSize: 18
          }}
        >
          ← Back
        </Link>

      </div>

    </main>

  )

}
