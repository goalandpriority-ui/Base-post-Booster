export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  try {

    const boosts = await prisma.boost.findMany({
      select: {
        wallet: true,
        amount: true,
        whale: true
      }
    })

    const map: Record<string, {
      wallet: string
      totalBoosts: number
      totalSpent: number
      whaleBoosts: number
    }> = {}

    for (const b of boosts) {

      const wallet = b.wallet.toLowerCase()

      if (!map[wallet]) {
        map[wallet] = {
          wallet,
          totalBoosts: 0,
          totalSpent: 0,
          whaleBoosts: 0
        }
      }

      map[wallet].totalBoosts += 1
      map[wallet].totalSpent += Number(b.amount)

      if (b.whale) {
        map[wallet].whaleBoosts += 1
      }

    }

    const leaderboard = Object.values(map)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 50)

    const result = leaderboard.map((u, index) => ({
      rank: index + 1,
      wallet: u.wallet,
      walletShort: `${u.wallet.slice(0,6)}...${u.wallet.slice(-4)}`,
      totalBoosts: u.totalBoosts,
      totalSpent: Number(u.totalSpent.toFixed(6)),
      whaleBoosts: u.whaleBoosts
    }))

    return NextResponse.json(result)

  } catch (error) {

    console.error("LEADERBOARD ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    )

  }

}
