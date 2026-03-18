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
        _count: { wallet: u.totalBoosts },
        _sum: { amount: u.totalSpent }
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
    if (rank === 0) return "👑"
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
        const eth = Number(user._sum.amount)
        const usd = (eth * 3000).toFixed(2) // approx ETH price

        return (

          <div
            key={user.wallet}
            style={{
              ...card,
              border: isTop
                ? "2px solid gold"
                : "1px solid rgba(255,255,255,0.1)",
              boxShadow: isTop
                ? "0 0 40px gold"
                : "none"
            }}
          >

            {isTop && <p style={{color:"gold"}}>👑 TOP BOOSTER</p>}

            <h3 style={rankStyle}>
              {getRankIcon(i)}
            </h3>

            <p style={walletStyle}>
              {user.wallet.slice(0,6)}...
              {user.wallet.slice(-4)}
            </p>

            <p style={{ marginTop: 10 }}>
              🚀 Boosts: {user._count.wallet}
            </p>

            <p style={ethStyle}>
              Ξ {eth.toFixed(6)} (~${usd})
            </p>

            {/* 🔥 PROGRESS BAR */}
            <div style={progressBg}>
              <div style={{
                ...progressFill,
                width: `${Math.min(user._count.wallet * 10, 100)}%`
              }} />
            </div>

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

/* STYLES */

const mainStyle = {
  minHeight:"100vh",
  background:"#0f172a",
  padding:30,
  textAlign:"center",
  color:"white"
}

const loadingStyle = {
  minHeight:"100vh",
  background:"#0f172a",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  color:"white"
}

const titleStyle = {
  fontSize:32,
  fontWeight:"bold",
  marginBottom:30,
  background:"linear-gradient(90deg,#6366f1,#22c55e)",
  WebkitBackgroundClip:"text",
  color:"transparent"
}

const card = {
  background:"rgba(255,255,255,0.05)",
  backdropFilter:"blur(10px)",
  padding:20,
  borderRadius:16,
  marginBottom:15
}

const rankStyle = { fontSize:22 }

const walletStyle = { fontWeight:"bold", fontSize:16 }

const ethStyle = {
  fontWeight:"bold",
  color:"#22c55e",
  marginTop:5
}

const progressBg = {
  height:6,
  background:"#1e293b",
  borderRadius:10,
  marginTop:10
}

const progressFill = {
  height:"100%",
  background:"linear-gradient(90deg,#22c55e,#4ade80)"
}

const backBtn = {
  fontWeight:"bold",
  fontSize:18,
  color:"#22c55e"
}
