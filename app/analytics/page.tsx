"use client"

import { useEffect,useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"

export default function AnalyticsPage(){

  const [data,setData] = useState([])

  useEffect(()=>{

    fetch("/api/live-boosts")
    .then(res=>res.json())
    .then((boosts)=>{

      const chart = boosts.map((b:any)=>({

        time:new Date(b.createdAt).toLocaleTimeString(),
        boosts:1

      }))

      setData(chart)

    })

  },[])

  return(

    <main style={{padding:40}}>

      <h1>Boost Activity</h1>

      <LineChart
        width={400}
        height={300}
        data={data}
      >

        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="boosts"
        />

      </LineChart>

    </main>

  )
}
