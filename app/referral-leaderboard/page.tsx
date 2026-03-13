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

<div
  style={{
    minHeight:"100vh",
    background:"#E3A6AE",
    padding:30,
    color:"black"
  }}
>

  <h1
    style={{
      fontSize:30,
      fontWeight:"bold",
      marginBottom:20
    }}
  >
    🏆 Referral Leaderboard
  </h1>

  <div style={{marginBottom:30}}>
    <Link href="/" style={{fontWeight:"bold"}}>
      ← Back to Home
    </Link>
  </div>

  {loading && <p>Loading leaderboard...</p>}

  {!loading && data.length===0 && (
    <p>No referrals yet</p>
  )}

  <div style={{display:"flex",flexDirection:"column",gap:15}}>

    {data.map((user,index)=>{

      return(

        <div
          key={index}
          style={{
            background:"white",
            padding:20,
            borderRadius:12
          }}
        >

          <h3 style={{marginBottom:10}}>
            #{index+1}
          </h3>

          <p
            style={{
              fontSize:13,
              wordBreak:"break-all"
            }}
          >
            {user.wallet}
          </p>

          <p>
            Referrals: {user.totalReferrals}
          </p>

          <p>
            Earnings: {user.totalEarnings.toFixed(6)} ETH
          </p>

        </div>

      )

    })}

  </div>

</div>

)

}
