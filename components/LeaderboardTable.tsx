"use client"

import { useEffect, useState } from "react"

export default function LeaderboardTable() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/boost")
      .then((res) => res.json())
      .then((d) => setData(d))
  }, [])

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <p>{item.postUrl}</p>
          <p>{item.amount} ETH</p>
          <p>Tier: {item.tier}</p>
        </div>
      ))}
    </div>
  )
}
