"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAccount, useConnect, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { sdk } from "@farcaster/miniapp-sdk"
import { useRouter, useSearchParams } from "next/navigation"

const YOUR_WALLET_ADDRESS = "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2"
const MINI_APP_LINK = "https://base-post-booster.vercel.app/"

export default function Page() {
return (
<Suspense fallback={<div>Loading...</div>}>
<Home />
</Suspense>
)
}

function Home() {

const router = useRouter()
const searchParams = useSearchParams()
const referralParam = searchParams.get("ref")

const [menuOpen,setMenuOpen]=useState(false)

const [referrer, setReferrer] = useState<string | null>(null)
const [selectedTier, setSelectedTier] = useState(0)
const [postLink, setPostLink] = useState("")
const [contract, setContract] = useState<string | null>(null)
const [coinData, setCoinData] = useState<any>(null)
const [coinLoading, setCoinLoading] = useState(false)
const [loading, setLoading] = useState(false)
const [txHash, setTxHash] = useState<string | undefined>(undefined)
const [savingBoost,setSavingBoost]=useState(false)

const { address, isConnected } = useAccount()
const { connect, connectors } = useConnect()
const { sendTransactionAsync } = useSendTransaction()

const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({
hash: txHash as `0x${string}` | undefined,
})

useEffect(() => {
if (referralParam) {
setReferrer(referralParam.toLowerCase())
}
}, [referralParam])

const tiers = [
{
name: "Basic",
price: "0.00001 ETH",
duration: "24 Hours Boost",
value: parseEther("0.00001"),
},
{
name: "Pro",
price: "0.003 ETH",
duration: "48 Hours Boost",
value: parseEther("0.003"),
},
{
name: "Elite",
price: "0.005 ETH",
duration: "72 Hours Boost",
value: parseEther("0.005"),
},
]

async function detectCoinFromBaseLink(link: string) {

if (!link.includes("/content/")) return

try {

const res = await fetch("/api/detectCoin", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ link }),
})

const data = await res.json()

if (data.contract) {
setContract(data.contract)
fetchCoinData(data.contract)
}

} catch (err) {
console.error("Coin detect failed", err)
}

}

async function fetchCoinData(contract: string) {

try {

setCoinLoading(true)

const res = await fetch("/api/coinData", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ contract }),
})

const data = await res.json()

if (!data.error) {
setCoinData(data)
}

} catch {
console.error("Coin data fetch failed")
} finally {
setCoinLoading(false)
}

}

async function handleBoost() {

if (!isConnected) {

const injectedConnector = connectors.find(
(connector) => connector.id === "injected"
)

if (injectedConnector) {
await connect({ connector: injectedConnector })
} else if (connectors.length > 0) {
await connect({ connector: connectors[0] })
} else {
alert("No wallet available")
}

return
}

if (!postLink) {
alert("Paste post link")
return
}

try {

setLoading(true)

const hash = await sendTransactionAsync({
to: YOUR_WALLET_ADDRESS as `0x${string}`,
value: tiers[selectedTier].value,
})

setTxHash(hash)

} catch (err: any) {

console.error(err)

alert(
"Transaction failed: " +
(err.shortMessage || err.message || "Unknown error")
)

setLoading(false)
}

}

async function shareToFarcaster(postUrl: string) {

const referralLink = `${MINI_APP_LINK}?ref=${address}`

const text = `🚀 I just boosted this post on Base Post Booster!

${postUrl}

Boost yours 👇
${referralLink}`

try {
await sdk.actions.composeCast({ text })
} catch {
window.open(
"https://warpcast.com/~/compose?text=" +
encodeURIComponent(text),
"_blank"
)
}

}

async function saveBoost() {

if (!txHash || savingBoost) return

setSavingBoost(true)

try {

const res = await fetch("/api/save-boost", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
wallet: address || "",
postUrl: postLink || "",
contract: contract || null,
txHash: txHash,
referrer: referrer || null
})
})

const data = await res.json()

if (!res.ok || data.error) {
throw new Error(data.error || "Boost save failed")
}

await shareToFarcaster(postLink)

alert("Boost successful 🚀")

setPostLink("")
setContract(null)
setCoinData(null)

setTimeout(() => {
router.push("/trending")
}, 1500)

} catch (err) {

console.error(err)
alert("Boost save failed")

} finally {

setLoading(false)
setSavingBoost(false)

}

}

useEffect(() => {
if (txConfirmed && txHash) {
saveBoost()
}
}, [txConfirmed, txHash])

return (

<main style={mainStyle}>

{/* HEADER */}

<div style={headerStyle}>

<h1 style={titleStyle}>
Base Post Booster
</h1>

<button onClick={()=>setMenuOpen(!menuOpen)} style={menuBtn}>
☰
</button>

</div>

{/* MENU */}

<AnimatePresence>
{menuOpen && (

<motion.div
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.25 }}
style={card}
>

<MenuItem href="/trending" label="🔥 Trending Posts" />
<MenuItem href="/leaderboard" label="🏆 Leaderboard" />
<MenuItem href="/referrals" label="💰 Referral Earnings" />
<MenuItem href="/referral-leaderboard" label="👑 Referral Leaderboard" />
<MenuItem href="/wars" label="⚔️ Token Wars" />

</motion.div>

)}
</AnimatePresence>

{/* REFERRER */}

{referrer && (
<p style={{ marginBottom: 20 }}>
🎯 Referred by: {referrer.slice(0,6)}...{referrer.slice(-4)}
</p>
)}

{/* WALLET */}

{address && (
<div style={card}>
<p>🟢 Wallet Connected</p>
<p>{address.slice(0,6)}...{address.slice(-4)}</p>

<p style={{fontSize:12,marginTop:10}}>
{MINI_APP_LINK}?ref={address}
</p>

<button
onClick={()=>{
navigator.clipboard.writeText(`${MINI_APP_LINK}?ref=${address}`)
alert("Referral link copied")
}}
style={copyBtn}
>
Copy Link
</button>

</div>
)}

{/* INPUT */}

<input
type="text"
placeholder="Paste Base post link"
value={postLink}
onChange={(e)=>{
const value=e.target.value
setPostLink(value)
detectCoinFromBaseLink(value)
}}
style={inputStyle}
/>

{coinLoading && <p style={{ marginTop:10 }}>Detecting token...</p>}

{contract && (
<div style={card}>
<p>📜 Contract</p>
<p style={{wordBreak:"break-all",fontSize:12}}>
{contract}
</p>
</div>
)}

{coinData && (
<div style={card}>
<h3>{coinData.name}</h3>
<p>{coinData.symbol}</p>
<p>${coinData.price}</p>
<p>MC: ${coinData.marketCap}</p>
</div>
)}

{/* TIERS */}

<div style={{ marginTop:30 }}>

{tiers.map((tier,index)=>(
<div
key={index}
onClick={()=>setSelectedTier(index)}
style={{
...card,
border:selectedTier===index
? "2px solid #22c55e"
: "1px solid rgba(255,255,255,0.1)"
}}
>
<h2>{tier.name}</h2>
<h3>{tier.price}</h3>
<p>{tier.duration}</p>
</div>
))}

</div>

{/* BUTTON */}

<button
onClick={handleBoost}
disabled={loading}
style={boostBtn}
>
{loading
? "Processing..."
: isConnected
? "🚀 Boost Now"
: "Connect Wallet"}
</button>

</main>

)

}

/* ---------------- MENU ITEM ---------------- */

function MenuItem({ href, label }: any) {

return (

<Link href={href} style={{ textDecoration: "none" }}>

<div
style={{
padding: "10px 12px",
borderRadius: 10,
marginBottom: 6,
color: "white",
background: "rgba(255,255,255,0.05)",
transition: "0.2s"
}}
>

{label}

</div>

</Link>

)

}

/* ---------------- STYLES ---------------- */

const mainStyle: React.CSSProperties = {
minHeight:"100vh",
background:"#0f172a",
color:"white",
padding:20,
maxWidth:500,
margin:"0 auto"
}

const headerStyle: React.CSSProperties = {
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}

const titleStyle: React.CSSProperties = {
background:"linear-gradient(90deg,#6366f1,#22c55e)",
padding:"10px 20px",
borderRadius:12
}

const menuBtn: React.CSSProperties = {
fontSize:22,
background:"none",
border:"none",
color:"white"
}

const card: React.CSSProperties = {
background:"rgba(255,255,255,0.05)",
backdropFilter:"blur(10px)",
padding:15,
borderRadius:12,
marginBottom:15
}

const inputStyle: React.CSSProperties = {
padding:12,
width:"100%",
borderRadius:10,
border:"1px solid rgba(255,255,255,0.1)",
background:"#1e293b",
color:"white"
}

const boostBtn: React.CSSProperties = {
marginTop:20,
padding:"14px",
width:"100%",
borderRadius:12,
background:"linear-gradient(90deg,#22c55e,#4ade80)",
color:"black",
fontWeight:"bold",
border:"none",
boxShadow:"0 0 20px rgba(34,197,94,0.6)"
}

const copyBtn: React.CSSProperties = {
marginTop:10,
padding:"6px 12px",
background:"#6366f1",
border:"none",
borderRadius:6,
color:"white"
}
