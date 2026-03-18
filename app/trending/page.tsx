"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

type Post = {
  id: string
  content: string
  contract: string
  boost_count: number
}

type PumpToken = {
  contract: string
  boosts: number
  wallets: number
  posts: number
  whale: boolean
  score: number
  status: string
}

const MINIAPP_URL = "https://base-post-booster.vercel.app"

export default function TrendingPage() {

const [posts, setPosts] = useState<Post[]>([])
const [pumpTokens, setPumpTokens] = useState<PumpToken[]>([])
const [tokenNames, setTokenNames] = useState<Record<string,string>>({})
const [loading, setLoading] = useState(true)
const [newIds, setNewIds] = useState<string[]>([])
const [expandedChart, setExpandedChart] = useState<string | null>(null)

const previousIds = useRef<string[]>([])
const fetchingContracts = useRef<Set<string>>(new Set())

const fetchPosts = async () => {

try {

  const res = await fetch("/api/trending")
  const raw = await res.json()
  const data = raw.posts || []

  const mapped: Post[] = data.map((p: any) => ({
    id: p.postUrl || p.contract,
    content: p.postUrl && p.postUrl.startsWith("http")
      ? p.postUrl
      : "No post link",
    contract: p.contract || "",
    boost_count: p.boosts || 0
  }))

  const sorted = mapped.sort(
    (a, b) => b.boost_count - a.boost_count
  )

  // 🔥 SAFE TOKEN FETCH (NO SPAM + FALLBACK READY)
  sorted.forEach(async (p)=>{
    if(
      p.contract &&
      !tokenNames[p.contract] &&
      !fetchingContracts.current.has(p.contract)
    ){
      fetchingContracts.current.add(p.contract)

      try{
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${p.contract}`)
        const data = await res.json()

        const name =
          data?.pairs?.[0]?.baseToken?.name ||
          data?.pairs?.[0]?.baseToken?.symbol

        if(name){
          setTokenNames(prev => ({...prev,[p.contract]:name}))
        }else{
          setTokenNames(prev => ({
            ...prev,
            [p.contract]:
              p.contract.slice(0,6) + "..." + p.contract.slice(-4)
          }))
        }

      }catch{
        setTokenNames(prev => ({
          ...prev,
          [p.contract]:
            p.contract.slice(0,6) + "..." + p.contract.slice(-4)
        }))
      }
    }
  })

  const currentIds = sorted.map((p) => p.id)

  const newlyAdded = currentIds.filter(
    (id) => !previousIds.current.includes(id)
  )

  if (previousIds.current.length > 0 && newlyAdded.length > 0) {
    setNewIds(newlyAdded)
    setTimeout(() => setNewIds([]), 3000)
  }

  previousIds.current = currentIds

  setPosts(sorted)
  setLoading(false)

} catch (err) {
  console.error(err)
  setLoading(false)
}

}

const fetchPump = async () => {

try {

  const res = await fetch("/api/pump-detection")
  const data = await res.json()

  if (data.success) {
    setPumpTokens(data.data)
  }

} catch (err) {
  console.error("Pump detection fetch failed", err)
}

}

useEffect(() => {

fetchPosts()
fetchPump()

const interval = setInterval(() => {
  fetchPosts()
  fetchPump()
}, 5000)

return () => clearInterval(interval)

}, [])

/* SHARE */
const handleShare = (post: Post) => {

  const text = encodeURIComponent(
    `🚀 Trending on Base Post Booster!\n\n` +
    `🔥 Boosts: ${post.boost_count}\n\n` +
    `👀 Check this post:\n${post.content}\n\n` +
    `📜 Contract:\n${post.contract}\n\n` +
    `⚡ Boost your own post:\n${MINIAPP_URL}`
  )

  window.open(`https://warpcast.com/~/compose?text=${text}`, "_blank")
}

if (loading) {

return (
  <div style={loadingStyle}>
    Loading trending posts...
  </div>
)

}

return (

<div style={mainStyle}>

<h1 style={titleStyle}>
🔥 Trending Boosts
</h1>

<div style={{ marginBottom: 30 }}>
<Link href="/" style={backBtn}>
← Back to Home
</Link>
</div>

{/* PUMP SECTION */}

{pumpTokens.length > 0 && (

<div style={glassCard}>

<h2 style={{ marginBottom: 20 }}>
🚀 Auto Pump Detection
</h2>

{pumpTokens.slice(0,5).map((token,index)=>{

let badge = ""

if(token.status==="trending") badge="🚀 TRENDING"
else if(token.status==="hot") badge="🔥 HOT"
else if(token.status==="pumping") badge="📈 PUMPING"
else badge="NORMAL"

return(

<div key={index} style={pumpItem}>

<p style={{ fontWeight:"bold", color:"#22c55e" }}>
{badge}
</p>

<p style={contractText}>
{token.contract || "unknown"}
</p>

<p style={{ fontSize:13 }}>
Boosts: {token.boosts} | Wallets: {token.wallets}
</p>

</div>

)

})}

</div>

)}

{/* POSTS */}

<motion.div layout style={{ display:"flex", flexDirection:"column", gap:20 }}>

<AnimatePresence>

{posts.map((post) => {

const isNew = newIds.includes(post.id)
const isExpanded = expandedChart === post.id

return (

<motion.div
key={post.id}
layout
initial={{ opacity:0, y:40 }}
animate={{ opacity:1, y:0 }}
transition={{ type:"spring", stiffness:400, damping:30 }}
style={{
...glassCard,
border: isNew ? "2px solid #22c55e" : "1px solid rgba(255,255,255,0.1)",
boxShadow: isNew ? "0 0 25px rgba(34,197,94,0.6)" : "none"
}}
>

{/* 🔥 TOKEN NAME FIXED */}
<p style={{color:"#22c55e",fontWeight:"bold"}}>
{tokenNames[post.contract] || (post.contract
  ? post.contract.slice(0,6)+"..."+post.contract.slice(-4)
  : "Unknown Token")}
</p>

{/* POST LINK */}
<a
href={post.content !== "No post link" ? post.content : "#"}
target="_blank"
rel="noopener noreferrer"
style={{
fontWeight:"bold",
wordBreak:"break-all",
color:"#60a5fa",
textDecoration:"underline"
}}
>
{post.content}
</a>

{/* CONTRACT CLICKABLE */}
<a
href={`https://dexscreener.com/base/${post.contract}`}
target="_blank"
style={{
fontSize:12,
color:"#9ca3af",
display:"block",
marginTop:5
}}
>
📜 {post.contract}
</a>

<button
onClick={()=>navigator.clipboard.writeText(post.contract)}
style={{
marginTop:5,
fontSize:12,
padding:"4px 8px",
borderRadius:6,
background:"#334155",
color:"white",
border:"none"
}}
>
Copy Contract
</button>

<div style={{ display:"flex", justifyContent:"space-between" }}>

<div>

<p style={{ fontSize:12 }}>
Boosts
</p>

<motion.p
key={post.boost_count}
initial={{ scale:1.4 }}
animate={{ scale:1 }}
transition={{ duration:0.3 }}
style={{
fontSize:22,
fontWeight:"bold",
color:"#22c55e"
}}
>
{post.boost_count}
</motion.p>

</div>

<div style={{ display:"flex", gap:10 }}>

<button
onClick={() =>
setExpandedChart(isExpanded ? null : post.id)
}
style={chartBtn}
>
{isExpanded ? "Hide" : "Chart"}
</button>

<button
onClick={() => handleShare(post)}
style={shareBtn}
>
Share
</button>

</div>

</div>

{isExpanded && (

<div style={chartContainer}>

<iframe
src={`https://dexscreener.com/base/${post.contract}?embed=1&theme=dark`}
style={{
width:"100%",
height:"100%",
border:"none"
}}
/>

</div>

)}

</motion.div>

)

})}

</AnimatePresence>

</motion.div>

</div>

)

}

/* STYLES */

const mainStyle: React.CSSProperties = {
minHeight:"100vh",
background:"#0f172a",
padding:30,
color:"white"
}

const loadingStyle: React.CSSProperties = {
minHeight:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#0f172a",
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

const glassCard: React.CSSProperties = {
background:"rgba(255,255,255,0.05)",
backdropFilter:"blur(10px)",
padding:20,
borderRadius:16,
marginBottom:20
}

const pumpItem: React.CSSProperties = {
padding:10,
borderBottom:"1px solid rgba(255,255,255,0.1)"
}

const contractText: React.CSSProperties = {
fontSize:12,
wordBreak:"break-all"
}

const chartBtn: React.CSSProperties = {
padding:"6px 12px",
borderRadius:8,
background:"#fbbf24",
border:"none",
fontWeight:"bold",
cursor:"pointer"
}

const shareBtn: React.CSSProperties = {
padding:"6px 12px",
borderRadius:8,
background:"#6366f1",
color:"white",
border:"none",
fontWeight:"bold",
cursor:"pointer"
}

const chartContainer: React.CSSProperties = {
marginTop:15,
height:400,
borderRadius:12,
overflow:"hidden",
background:"black"
}
