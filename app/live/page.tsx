"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Boost = {
  id: string
  wallet: string
  postUrl: string
  amount: string
  createdAt: string
}

export default function LivePage() {

  const [boosts,setBoosts] = useState<Boost[]>([])

  async function loadBoosts() {

    const res = await fetch("/api/live-boosts")
    const data = await res.json()

    setBoosts(data)
  }

  useEffect(() => {

    loadBoosts()

    const interval = setInterval(loadBoosts,3000)

    return () => clearInterval(interval)

  },[])

  return (

    <main
      style={{
        minHeight:"100vh",
        padding:30,
        background:"#E3A6AE"
      }}
    >

      <h1 style={{fontSize:28,fontWeight:"bold"}}>
        ⚡ Live Boost Feed
      </h1>

      <Link href="/">← Back</Link>

      <div style={{marginTop:20}}>

        {boosts.map((b)=>(

          <div
            key={b.id}
            style={{
              background:"white",
              padding:15,
              marginBottom:15,
              borderRadius:10
            }}
          >

            <p>
              {b.wallet.slice(0,6)}...
              {b.wallet.slice(-4)}
            </p>

            <p>
              Boosted: {b.amount} ETH
            </p>

            <a href={b.postUrl} target="_blank">
              View Post
            </a>

          </div>

        ))}

      </div>

    </main>

  )
}
