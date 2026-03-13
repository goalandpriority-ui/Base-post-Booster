"use client"

import { useAccount } from "wagmi"
import { useEffect,useState } from "react"

export default function Referrals(){

const {address} = useAccount()

const [data,setData] = useState<any>(null)

useEffect(()=>{

if(!address) return

fetch("/api/referrals",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({wallet:address})
})
.then(res=>res.json())
.then(setData)

},[address])

if(!data) return <div>Loading...</div>

return(

<div style={{padding:20}}>

<h1>👥 Referral Dashboard</h1>

<p>Boosts from referrals: {data.count}</p>

<p>Earnings: {data.earned} ETH</p>

</div>

)

}
