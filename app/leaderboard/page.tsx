"use client"

import { useEffect, useState } from "react"

export default function LeaderboardPage() {

  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((res) => setData(res))
  }, [])

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        🏆 Top Boosters
      </h1>

      <div className="space-y-4">

        {data.map((item, index) => (

          <div
            key={index}
            className="p-4 bg-gray-900 rounded-xl flex justify-between"
          >

            <div>

              <p className="font-semibold">
                #{index + 1}
              </p>

              <p className="text-sm opacity-70">
                {item.wallet.slice(0,6)}...
                {item.wallet.slice(-4)}
              </p>

            </div>

            <div className="font-bold">

              {item._sum.amount} ETH

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}
