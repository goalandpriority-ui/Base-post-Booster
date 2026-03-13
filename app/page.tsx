"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
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

const [referrer, setReferrer] = useState<string | null>(null)
const [selectedTier, setSelectedTier] = useState(0)
const [postLink, setPostLink] = useState("")
const [contract, setContract] = useState("")
const [coinData, setCoinData] = useState<any>(null)
const [coinLoading, setCoinLoading] = useState(false)
const [loading, setLoading] = useState(false)

const [txHash, setTxHash] = useState<string | undefined>(undefined)

const { address, isConnected } = useAccount()
const { connect, connectors } = useConnect()
const { sendTransactionAsync } = useSendTransaction()

const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({
hash: txHash as "0x${string}" | undefined,
})

useEffect(() => {
if (referralParam) {
setReferrer(referralParam)
}
}, [referralParam])

const tiers = [
{
name: "Basic",
price: "0.00001 ETH",
duration: "24 Hours Boost",
value: parseEther("0.00001"),
eth: "0.00001",
},
{
name: "Pro",
price: "0.003 ETH",
duration: "48 Hours Boost",
value: parseEther("0.003"),
eth: "0.003",
},
{
name: "Elite",
price: "0.005 ETH",
duration: "72 Hours Boost",
value: parseEther("0.005"),
eth: "0.005",
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

if (!txHash) return

try {

  const res = await fetch("/api/save-boost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      wallet: address || "",
      postUrl: postLink || "",
      contract: contract || "unknown",
      txHash: String(txHash),
      amount: Number(tiers[selectedTier].eth),
      referrer: referrer || ""
    })
  })

  if (!res.ok) throw new Error("Boost save failed")

  await shareToFarcaster(postLink)

  alert("Boost successful 🚀")

  setPostLink("")
  setContract("")
  setCoinData(null)

  setTimeout(() => {
    router.push("/trending")
  }, 1500)

} catch (err) {

  console.error(err)
  alert("Boost save failed")

} finally {

  setLoading(false)

}

}

useEffect(() => {
if (txConfirmed && txHash) {
saveBoost()
setTxHash(undefined)
}
}, [txConfirmed, txHash])

return (

<main style={{
  minHeight: "100vh",
  background: "#E3A6AE",
  padding: 20,
  textAlign: "center",
  maxWidth: 500,
  margin: "0 auto",
  color: "black"
}}>

  <h1 style={{
    fontSize: 30,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#ffffff",
    background: "#3b82f6",
    padding: "10px 20px",
    borderRadius: 12
  }}>
    Base Post Booster
  </h1>

  {referrer && (
    <p style={{ marginBottom: 20, fontWeight: "bold" }}>
      Referred by: {referrer.slice(0,6)}...{referrer.slice(-4)}
    </p>
  )}

  {address && (
    <div style={{
      background:"#ffffff",
      padding:12,
      borderRadius:8,
      marginBottom:20
    }}>
      <p>Your referral link</p>

      <p style={{
        fontSize:12,
        wordBreak:"break-all"
      }}>
        {MINI_APP_LINK}?ref={address}
      </p>

      <button
        onClick={()=>{
          navigator.clipboard.writeText(`${MINI_APP_LINK}?ref=${address}`)
          alert("Referral link copied")
        }}
        style={{
          marginTop:8,
          padding:"6px 12px",
          background:"#3b82f6",
          border:"none",
          borderRadius:6,
          color:"white"
        }}
      >
        Copy Link
      </button>

    </div>
  )}

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

  {coinLoading && (
    <p style={{ marginTop:10 }}>Detecting token...</p>
  )}

  {contract && (
    <div style={{
      background:"#ffffff",
      padding:15,
      borderRadius:10,
      marginTop:15
    }}>
      <p><b>Contract:</b></p>
      <p style={{
        wordBreak:"break-all",
        fontSize:13
      }}>
        {contract}
      </p>
    </div>
  )}

  {coinData && (
    <div style={{
      background:"#ffffff",
      padding:15,
      borderRadius:10,
      marginTop:15
    }}>
      <h3>{coinData.name}</h3>
      <p><b>Symbol:</b> {coinData.symbol}</p>
      <p><b>Price:</b> ${coinData.price}</p>
      <p><b>Market Cap:</b> ${coinData.marketCap}</p>
    </div>
  )}

  <div style={{ marginTop:30 }}>
    {tiers.map((tier,index)=>(
      <div
        key={index}
        onClick={()=>setSelectedTier(index)}
        style={{
          background:selectedTier===index ? "#d1fae5":"#ffffff",
          padding:20,
          borderRadius:12,
          marginBottom:15,
          cursor:"pointer",
          border:selectedTier===index?"2px solid green":"1px solid #ccc"
        }}
      >
        <h2>{tier.name}</h2>
        <h3>{tier.price}</h3>
        <p>{tier.duration}</p>
      </div>
    ))}
  </div>

  <button
    onClick={handleBoost}
    disabled={loading}
    style={{
      marginTop:20,
      padding:"14px 20px",
      background:"black",
      border:"none",
      color:"white",
      fontWeight:"bold",
      borderRadius:10,
      width:"100%",
      fontSize:16
    }}
  >
    {loading
      ? "Processing..."
      : isConnected
      ? "Boost Now"
      : "Connect Wallet"}
  </button>

  <div style={{ marginTop: 40 }}>
    <Link href="/trending">View Trending Posts →</Link>
  </div>

  <div style={{ marginTop: 20 }}>
    <Link href="/leaderboard">View Leaderboard →</Link>
  </div>

  <div style={{ marginTop: 20 }}>
    <Link href="/referrals">Referral Earnings →</Link>
  </div>

</main>

)
}

const inputStyle: React.CSSProperties = {
padding:12,
width:"100%",
borderRadius:10,
border:"1px solid #999",
background:"#ffffff",
color:"black"
}
