"use client"

import { useEffect,useState } from "react"
import Link from "next/link"

type Coin = {
  contract:string
  _count:{contract:number}
}

export default function CoinsPage(){

  const [coins,setCoins] = useState<Coin[]>([])

  useEffect(()=>{

    fetch("/api/top-coins")
    .then(res=>res.json())
    .then(data=>setCoins(data))

  },[])

  return(

    <main
      style={{
        minHeight:"100vh",
        background:"#E3A6AE",
        padding:30
      }}
    >

      <h1 style={{fontSize:28,fontWeight:"bold"}}>
        🪙 Top Boosted Coins
      </h1>

      <Link href="/">← Back</Link>

      <div style={{marginTop:20}}>

        {coins.map((coin,i)=>(

          <div
            key={i}
            style={{
              background:"white",
              padding:15,
              marginBottom:15,
              borderRadius:10
            }}
          >

            <p>Rank #{i+1}</p>

            <p>
              {coin.contract.slice(0,8)}...
            </p>

            <p>
              Boosts: {coin._count.contract}
            </p>

          </div>

        ))}

      </div>

    </main>

  )
      }
