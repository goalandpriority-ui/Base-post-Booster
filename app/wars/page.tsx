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

const interval = setInterval(() => {
fetchWars()
}, 10000)

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

<main style={{
  minHeight: "100vh",
  background: "#E3A6AE",
  padding: 20,
  maxWidth: 500,
  margin: "0 auto"
}}>

  <h1 style={{
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    background: "#ef4444",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20
  }}>
    ⚔️ Token Wars
  </h1>

  <p style={{
    textAlign: "center",
    marginBottom: 20
  }}>
    Boost your coin and push it to the top 🚀
  </p>

  {loading && (
    <p style={{ textAlign: "center" }}>Loading wars...</p>
  )}

  {!loading && coins.length === 0 && (
    <p style={{ textAlign: "center" }}>No battles yet</p>
  )}

  {coins.map((coin, index) => {

  const trending = isTrending(coin.lastBoost)

  return (

    <div
      key={coin.contract}
      style={{
        background: "white",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15
      }}
    >

      <h2>
        #{index + 1} {coin.name} ({coin.symbol})
        {trending && " 🔥"}
      </h2>

      <p>
        Boosts: <b>{coin.boosts}</b>
      </p>

      <p>
        Whale Boosts: 🐋 <b>{coin.whales}</b>
      </p>

      <p>
        Volume: Ξ {coin.volume.toFixed(4)}
      </p>

      <p>
        Score: <b>{Math.round(coin.score)}</b>
      </p>

      <p>
        Market Cap: ${coin.marketCap || "Unknown"}
      </p>

      <p
        style={{
          fontSize: 12,
          wordBreak: "break-all"
        }}
      >
        {coin.contract}
      </p>

      <Link
        href="/"
        style={{
          display: "inline-block",
          marginTop: 10,
          background: "black",
          color: "white",
          padding: "6px 12px",
          borderRadius: 6,
          textDecoration: "none"
        }}
      >
        Boost this coin
      </Link>

    </div>

  )

  })}

  <div style={{ textAlign: "center", marginTop: 30 }}>
    <Link href="/">← Back to Boost</Link>
  </div>

</main>

)

}
