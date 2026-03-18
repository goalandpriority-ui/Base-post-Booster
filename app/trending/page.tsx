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
const [tokenImages, setTokenImages] = useState<Record<string,string>>({})
const [tokenPrices, setTokenPrices] = useState<Record<string,string>>({})
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

  // TOKEN FETCH
  sorted.forEach(async (p)=>{
    if(p.contract && !fetchingContracts.current.has(p.contract)){
      fetchingContracts.current.add(p.contract)

      try{
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${p.contract}`)
        const data = await res.json()

        const pair = data?.pairs?.[0]

        const name =
          pair?.baseToken?.name ||
          pair?.baseToken?.symbol

        const image =
          pair?.info?.imageUrl ||
          pair?.baseToken?.logoURI

        const price =
          pair?.priceUsd

        setTokenNames(prev => ({
          ...prev,
          [p.contract]: name
            ? name
            : p.contract.slice(0,6)+"..."+p.contract.slice(-4)
        }))

        if(image){
          setTokenImages(prev => ({
            ...prev,
            [p.contract]: image
          }))
        }

        setTokenPrices(prev => ({
          ...prev,
          [p.contract]: price
            ? Number(price).toFixed(6)
            : "0.000000"
        }))

      }catch{
        setTokenNames(prev => ({
          ...prev,
          [p.contract]:
            p.contract.slice(0,6)+"..."+p.contract.slice(-4)
        }))

        setTokenPrices(prev => ({
          ...prev,
          [p.contract]: "0.000000"
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

  const safePostUrl =
    post.content && post.content.startsWith("http")
      ? post.content
      : ""

  const appUrl = MINIAPP_URL.startsWith("http")
    ? MINIAPP_URL
    : `https://${MINIAPP_URL}`

  const text = encodeURIComponent(
    `🚀 Trending on Base Post Booster!\n\n` +
    `🔥 Boosts: ${post.boost_count}\n\n` +

    (safePostUrl
      ? `👀 Check this post:\n${safePostUrl}\n\n`
      : "") +

    `📜 Contract:\n${post.contract}\n\n` +

    `⚡ Open Booster:\n${appUrl}`
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

<motion.div layout style={{ display:"flex", flexDirection:"column", gap:20 }}>

<AnimatePresence>

{posts.map((post, index) => {

const isNew = newIds.includes(post.id)
const isExpanded = expandedChart === post.id
const isTop = index === 0

return (

<motion.div
key={post.id}
layout
initial={{ opacity:0, y:40 }}
animate={{ opacity:1, y:0 }}
transition={{ type:"spring", stiffness:400, damping:30 }}
style={{
...glassCard,
border: isTop
  ? "2px solid gold"
  : isNew
    ? "2px solid #22c55e"
    : "1px solid rgba(255,255,255,0.1)",
boxShadow: isTop
  ? "0 0 40px gold"
  : isNew
    ? "0 0 25px rgba(34,197,94,0.6)"
    : "none"
}}
>

{isTop && (
  <p style={{color:"gold",fontWeight:"bold"}}>
    👑 #1 TRENDING
  </p>
)}

{/* TOKEN HEADER */}
<div style={{display:"flex",alignItems:"center",gap:10}}>

{tokenImages[post.contract] ? (
  <img
    src={tokenImages[post.contract]}
    style={{width:30,height:30,borderRadius:"50%"}}
  />
) : (
  <div style={{
    width:30,
    height:30,
    borderRadius:"50%",
    background:"#1e293b"
  }} />
)}

<div>
<p style={{color:"#22c55e",fontWeight:"bold"}}>
{tokenNames[post.contract] || "Loading token..."}
</p>

<p style={{fontSize:12,color:"#9ca3af"}}>
💰 ${tokenPrices[post.contract] || "0.000000"}
</p>
</div>

</div>

<a
href={post.content !== "No post link" ? post.content : "#"}
target="_blank"
style={{
fontWeight:"bold",
wordBreak:"break-all",
color:"#60a5fa",
textDecoration:"underline"
}}
>
{post.content}
</a>

<a
href={`https://dexscreener.com/base/${post.contract}`}
target="_blank"
style={{fontSize:12,color:"#9ca3af"}}
>
📜 {post.contract}
</a>

<button
onClick={()=>navigator.clipboard.writeText(post.contract)}
style={{
marginTop:5,
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
<p>Boosts</p>
<p style={{fontSize:22,color:"#22c55e"}}>
{post.boost_count}
</p>
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
style={{width:"100%",height:"100%",border:"none"}}
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

const chartBtn: React.CSSProperties = {
padding:"6px 12px",
borderRadius:8,
background:"#fbbf24",
border:"none"
}

const shareBtn: React.CSSProperties = {
padding:"6px 12px",
borderRadius:8,
background:"#6366f1",
color:"white",
border:"none"
}

const chartContainer: React.CSSProperties = {
marginTop:15,
height:400,
borderRadius:12,
overflow:"hidden",
background:"black"
}
