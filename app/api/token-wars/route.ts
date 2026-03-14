export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  try {

    const boosts = await prisma.boost.findMany({
      select: {
        contract: true,
        amount: true,
        createdAt: true
      },
      where: {
        contract: {
          not: "unknown"
        }
      }
    })

    const map: Record<string, any> = {}

    const now = Date.now()

    for (const boost of boosts) {

      const contract = boost.contract || "unknown"

      if (!map[contract]) {

        map[contract] = {
          contract: contract,
          name: contract.slice(0,6),
          symbol: "TOKEN",
          boosts: 0,
          whales: 0,
          volume: 0,
          lastBoost: boost.createdAt,
          marketCap: 0
        }

      }

      const amount = Number(boost.amount || 0)

      map[contract].boosts += 1
      map[contract].volume += amount

      if (amount >= 0.05) {
        map[contract].whales += 1
      }

      if (boost.createdAt > map[contract].lastBoost) {
        map[contract].lastBoost = boost.createdAt
      }

    }

    const tokens = Object.values(map).map((token: any) => {

      const hoursOld =
        (now - new Date(token.lastBoost).getTime()) / 3600000

      const score =
        (token.boosts * 10) +
        (token.volume * 150) +
        (token.whales * 25) -
        hoursOld

      return {
        contract: token.contract,
        name: token.name,
        symbol: token.symbol,
        boosts: token.boosts,
        whales: token.whales,
        volume: token.volume,
        marketCap: token.marketCap,
        lastBoost: token.lastBoost,
        score: score
      }

    })

    const ranked = tokens
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)

    return NextResponse.json(ranked)

  } catch (err) {

    console.error("TOKEN WARS ERROR:", err)

    return NextResponse.json(
      { error: "wars failed" },
      { status: 500 }
    )

  }

}
