"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type War = {
  contract: string
  _count: {
    contract: number
  }
}

export default function WarsPage() {

  const [wars, setWars] = useState<War[]>([])

  useEffect(() => {

    fetch("/api/wars")
      .then((res) => res.json())
      .then((data) => setWars(data))

  }, [])

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#E3A6AE",
        padding: 30,
        textAlign: "center"
      }}
    >

      <h1
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 30
        }}
      >
        🔥 Token Boost Wars
      </h1>

      {wars.map((token, i) => (

        <div
          key={i}
          style={{
            background: "white",
            padding: 20,
            borderRadius: 12,
            marginBottom: 15
          }}
        >

          <p>
            Token
          </p>

          <h3>
            {token.contract.slice(0,8)}...
          </h3>

          <p>
            Boosts
          </p>

          <h2>
            {token._count.contract}
          </h2>

        </div>

      ))}

      <Link href="/" style={{ fontWeight: "bold" }}>
        ← Back
      </Link>

    </main>

  )

}
