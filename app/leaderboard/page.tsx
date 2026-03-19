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
        const usd = (eth * 3000).toFixed(2)

        return (

          <div
            key={user.wallet}
            style={{
              ...card,
              border: isTop ? "2px solid gold" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: isTop ? "0 0 40px gold" : "none"
            }}
          >

            {/* 👑 TOP USER BADGE */}
            {isTop && (
              <p style={{
                color:"gold",
                fontWeight:"bold",
                marginBottom:5
              }}>
                👑 TOP BOOSTER
              </p>
            )}

            <h3 style={rankStyle}>
              {getRankIcon(i)}
            </h3>

            <p style={walletStyle}>
              {user.wallet.slice(0,6)}...
              {user.wallet.slice(-4)}
            </p>

            <p style={{ marginTop: 10 }}>
              🚀 Boosts: <b>{user._count.wallet}</b>
            </p>

            <p style={ethStyle}>
              Ξ {eth.toFixed(6)} (~${usd})
            </p>

            {/* 📊 PROGRESS BAR */}
            <div style={progressBg}>
              <div style={{
                ...progressFill,
                width: `${Math.min(user._count.wallet * 10, 100)}%`
              }} />
            </div>

            {/* 🚀 SHARE BUTTON (VIRAL FEATURE) */}
            <button
              onClick={() => {

                const text = encodeURIComponent(
                  `🏆 I'm a Top Booster on Base!\n\n` +
                  `🚀 Boosts: ${user._count.wallet}\n` +
                  `💰 ETH Spent: ${eth.toFixed(6)}\n\n` +
                  `Can you beat me? 😏👇\n` +
                  `https://base-post-booster.vercel.app`
                )

                window.open(`https://warpcast.com/~/compose?text=${text}`)
              }}
              style={shareBtn}
            >
              Share 🚀
            </button>

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
  fontSize:22
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

const progressBg: React.CSSProperties = {
  height:6,
  background:"#1e293b",
  borderRadius:10,
  marginTop:10
}

const progressFill: React.CSSProperties = {
  height:"100%",
  background:"linear-gradient(90deg,#22c55e,#4ade80)"
}

const shareBtn: React.CSSProperties = {
  marginTop:12,
  padding:"8px 14px",
  borderRadius:10,
  background:"linear-gradient(90deg,#6366f1,#22c55e)",
  color:"white",
  border:"none",
  fontWeight:"bold",
  cursor:"pointer"
}

const backBtn: React.CSSProperties = {
  fontWeight:"bold",
  fontSize:18,
  color:"#22c55e"
}
