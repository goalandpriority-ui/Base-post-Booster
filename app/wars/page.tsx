"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type WarCoin = {
contract: string
name: string
symbol: string
marketCap: number
boosts: number
whales: number
volume: number
score: number
lastBoost: string
}

export default function TokenWars() {

const [coins, setCoins] = useState<WarCoin[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
fetchWars()
const interval = setInterval(fetchWars, 10000)
return () => clearInterval(interval)
}, [])

async function fetchWars() {
try {
  const res = await fetch("/api/token-wars")
  const data = await res.json()
  setCoins(data)
} catch (err) {
  console.error("wars fetch failed", err)
} finally {
  setLoading(false)
}
}

function isTrending(lastBoost:string){
const diff =
(Date.now() - new Date(lastBoost).getTime()) / 60000
return diff < 30
}

return (

<main style={mainStyle}>

<h1 style={titleStyle}>
⚔️ Token Wars
</h1>

<p style={{ textAlign:"center", marginBottom:20 }}>
Boost your coin and dominate the leaderboard 🚀
</p>

{coins.map((coin, index) => {

const trending = isTrending(coin.lastBoost)
const isTop = index === 0

return (

<div
key={coin.contract}
style={{
...card,
border: isTop ? "2px solid gold" : "1px solid rgba(255,255,255,0.1)",
boxShadow: isTop ? "0 0 40px gold" : "none"
}}
>

{isTop && <p style={{color:"gold"}}>👑 KING TOKEN</p>}

<h2>
{index === 0 ? "👑 #1" : `#${index + 1}`} {coin.name} ({coin.symbol})
{trending && " 🔥"}
</h2>

<p>🚀 Boosts: <b>{coin.boosts}</b></p>

<p>🐋 Whale Boosts: <b>{coin.whales}</b></p>

<p>💰 Volume: Ξ {coin.volume.toFixed(4)}</p>

<p>
📊 Score: <b style={{color:"#22c55e"}}>
{Math.round(coin.score)}
</b>
</p>

{/* 🔥 PROGRESS BAR */}
<div style={progressBg}>
  <div style={{
    ...progressFill,
    width:`${Math.min(coin.score,100)}%`
  }} />
</div>

<p>🏦 Market Cap: ${coin.marketCap || "Unknown"}</p>

<p style={contractText}>{coin.contract}</p>

{coin.whales > 0 && (
<p style={{color:"#facc15"}}>
🐋 Whale Activity Detected
</p>
)}

<Link href="/" style={boostBtn}>
Boost this coin
</Link>

</div>

)

})}

<div style={{ textAlign:"center", marginTop:30 }}>
<Link href="/" style={backBtn}>← Back</Link>
</div>

</main>

)

}

/* STYLES */

const mainStyle = {
minHeight:"100vh",
background:"#0f172a",
padding:20,
maxWidth:500,
margin:"0 auto",
color:"white"
}

const titleStyle = {
fontSize:30,
textAlign:"center",
fontWeight:"bold",
marginBottom:20,
background:"linear-gradient(90deg,#ef4444,#22c55e)",
WebkitBackgroundClip:"text",
color:"transparent"
}

const card = {
background:"rgba(255,255,255,0.05)",
backdropFilter:"blur(10px)",
padding:15,
borderRadius:16,
marginBottom:15
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

const contractText = {
fontSize:12,
wordBreak:"break-all",
opacity:0.7
}

const boostBtn = {
display:"inline-block",
marginTop:10,
background:"linear-gradient(90deg,#22c55e,#4ade80)",
color:"black",
padding:"6px 12px",
borderRadius:8,
textDecoration:"none",
fontWeight:"bold",
boxShadow:"0 0 15px rgba(34,197,94,0.6)"
}

const backBtn = {
color:"#22c55e",
fontWeight:"bold"
}
