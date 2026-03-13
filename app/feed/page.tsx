"use client"

import { useEffect, useState } from "react"

export default function Feed() {

const [boosts,setBoosts] = useState<any[]>([])

async function loadFeed(){

const res = await fetch("/api/boost-feed")

const data = await res.json()

setBoosts(data)

}

useEffect(()=>{

loadFeed()

const interval = setInterval(loadFeed,5000)

return ()=>clearInterval(interval)

},[])

return(

<div style={{padding:20}}>

<h1>🔥 Live Boost Feed</h1>

{boosts.map((b,i)=>(

<div key={i} style={{
border:"1px solid #ddd",
padding:12,
marginTop:10,
borderRadius:10
}}>

<p><b>{b.wallet.slice(0,6)}...{b.wallet.slice(-4)}</b></p>

<p>Boosted {b.amount} ETH</p>

<a href={b.postUrl} target="_blank">
View Post
</a>

</div>

))}

</div>

)

}
