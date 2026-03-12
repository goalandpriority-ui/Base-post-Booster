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

  useEffect(() => {

    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setUsers(data))

  }, [])

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
          fontSize: 30,
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
          }}
        >

          <h3>#{i + 1}</h3>

          <p>
            {user.wallet.slice(0,6)}...
            {user.wallet.slice(-4)}
          </p>

          <p>
            Boosts: {user._count.wallet}
          </p>

          <p>
            ETH Spent: {user._sum.amount}
          </p>

        </div>

      ))}

      <Link href="/" style={{ fontWeight: "bold" }}>
        ← Back
      </Link>

    </main>

  )
}
