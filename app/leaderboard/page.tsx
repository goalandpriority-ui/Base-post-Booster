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

      const raw = await res.json()

      const data: User[] = raw.map((u: any) => ({
        wallet: u.wallet,
        _count: {
          wallet: u.totalBoosts
        },
        _sum: {
          amount: u.totalSpent
        }
      }))

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
      <main style={loadingStyle}>
        Loading leaderboard...
      </main>
    )

  }

  return (

    <main style={mainStyle}>

      <h1 style={titleStyle}>
        🏆 Top Boosters
      </h1>

      {users.map((user, i) => {

        const isTop = i === 0

        return (

          <div
            key={user.wallet}
            style={{
              ...card,
              border: isTop
                ? "2px solid #22c55e"
                : "1px solid rgba(255,255,255,0.1)",
              boxShadow: isTop
                ? "0 0 25px rgba(34,197,94,0.6)"
                : "none"
            }}
          >

            <h3 style={rankStyle}>
              {getRankIcon(i)}
            </h3>

            <p style={walletStyle}>
              {user.wallet.slice(0,6)}...
              {user.wallet.slice(-4)}
            </p>

            <p style={{ marginTop: 10 }}>
              Boosts: {user._count.wallet}
            </p>

            <p style={ethStyle}>
              ETH Spent: {Number(user._sum.amount).toFixed(6)}
            </p>

          </div>

        )

      })}

      <div style={{ marginTop: 40 }}>

        <Link href="/" style={backBtn}>
          ← Back
        </Link>

      </div>

    </main>

  )

}

/* ---------------- STYLES ---------------- */

const mainStyle: React.CSSProperties = {
  minHeight:"100vh",
  background:"#0f172a",
  padding:30,
  textAlign:"center",
  color:"white"
}

const loadingStyle: React.CSSProperties = {
  minHeight:"100vh",
  background:"#0f172a",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  color:"white"
}

const titleStyle: React.CSSProperties = {
  fontSize:32,
  fontWeight:"bold",
  marginBottom:30,
  background:"linear-gradient(90deg,#6366f1,#22c55e)",
  WebkitBackgroundClip:"text",
  color:"transparent"
}

const card: React.CSSProperties = {
  background:"rgba(255,255,255,0.05)",
  backdropFilter:"blur(10px)",
  padding:20,
  borderRadius:16,
  marginBottom:15
}

const rankStyle: React.CSSProperties = {
  fontSize:22,
  marginBottom:10
}

const walletStyle: React.CSSProperties = {
  fontWeight:"bold",
  fontSize:16
}

const ethStyle: React.CSSProperties = {
  fontWeight:"bold",
  color:"#22c55e",
  marginTop:5
}

const backBtn: React.CSSProperties = {
  fontWeight:"bold",
  fontSize:18,
  color:"#22c55e"
}
