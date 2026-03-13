"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import Link from "next/link"

type ReferralStats = {
  wallet: string
  totalBoosts: number
  totalVolume: number
  earnings: number
}

export default function ReferralPage() {

  const { address } = useAccount()

  const [stats, setStats] = useState<ReferralStats | null>(null)

  useEffect(() => {

    if (!address) return

    fetch(`/api/referrals?wallet=${address}`)
      .then((res) => res.json())
      .then((data) => setStats(data))

  }, [address])

  if (!address) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Connect wallet to view referrals</h2>
      </main>
    )
  }

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#E3A6AE",
        padding: 30,
        textAlign: "center"
      }}
    >

      <h1 style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
        💰 Referral Dashboard
      </h1>

      <div
        style={{
          background: "white",
          padding: 25,
          borderRadius: 12,
          maxWidth: 500,
          margin: "auto"
        }}
      >

        <p>
          <b>Your wallet</b>
        </p>

        <p>
          {address.slice(0,6)}...{address.slice(-4)}
        </p>

        <hr style={{ margin: "20px 0" }} />

        <p>
          Total Referral Boosts
        </p>

        <h2>
          {stats?.totalBoosts || 0}
        </h2>

        <p>
          Total Volume
        </p>

        <h2>
          {stats?.totalVolume || 0} ETH
        </h2>

        <p>
          Your Earnings (10%)
        </p>

        <h2>
          {stats?.earnings || 0} ETH
        </h2>

      </div>

      <br/>

      <Link href="/" style={{ fontWeight: "bold" }}>
        ← Back
      </Link>

    </main>

  )

}
