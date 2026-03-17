"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Referrer = {
wallet: string
totalEarnings: number
totalReferrals: number
}

export default function ReferralLeaderboard() {

const [data,setData] = useState<Referrer[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

async function fetchLeaderboard(){

  try{

    const res = await fetch("/api/referral-leaderboard")

    const result = await res.json()

    setData(result)

  }catch(err){

    console.error(err)

  }finally{

    setLoading(false)

  }

}

fetchLeaderboard()

},[])

return(

<div style={mainStyle}>

<h1 style={titleStyle}>
🏆 Referral Leaderboard
</h1>

<div style={{marginBottom:30}}>
<Link href="/" style={backBtn}>
← Back to Home
</Link>
</div>

{loading && <p>Loading leaderboard...</p>}

{!loading && data.length===0 && (
<p>No referrals yet</p>
)}

<div style={{display:"flex",flexDirection:"column",gap:15}}>

{data.map((user,index)=>{

const isTop = index === 0

return(

<div
key={index}
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
{index === 0 ? "👑 #1" : `#${index+1}`}
</h3>

<p style={walletStyle}>
{user.wallet.slice(0,6)}...
{user.wallet.slice(-4)}
</p>

<p style={{marginTop:10}}>
👥 Referrals: {user.totalReferrals}
</p>

<p style={earnStyle}>
💰 {user.totalEarnings.toFixed(6)} ETH
</p>

</div>

)

})}

</div>

</div>

)

}

/* ---------------- STYLES ---------------- */

const mainStyle: React.CSSProperties = {
minHeight:"100vh",
background:"#0f172a",
padding:30,
color:"white"
}

const titleStyle: React.CSSProperties = {
fontSize:30,
fontWeight:"bold",
marginBottom:20,
background:"linear-gradient(90deg,#6366f1,#22c55e)",
WebkitBackgroundClip:"text",
color:"transparent"
}

const backBtn: React.CSSProperties = {
fontWeight:"bold",
color:"#22c55e"
}

const card: React.CSSProperties = {
background:"rgba(255,255,255,0.05)",
backdropFilter:"blur(10px)",
padding:20,
borderRadius:16
}

const rankStyle: React.CSSProperties = {
marginBottom:10,
fontSize:20
}

const walletStyle: React.CSSProperties = {
fontSize:13,
wordBreak:"break-all"
}

const earnStyle: React.CSSProperties = {
marginTop:5,
color:"#22c55e",
fontWeight:"bold"
}
