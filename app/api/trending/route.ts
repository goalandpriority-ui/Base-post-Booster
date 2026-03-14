import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {

    const now = new Date()
    const last72 = new Date(Date.now() - 72 * 60 * 60 * 1000)

    const boosts = await prisma.boost.findMany({
      where: {
        createdAt: {
          gte: last72
        },
        expiresAt: {
          gt: now
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const contractMap: Record<string, any> = {}

    for (const boost of boosts) {

      const key = boost.contract ? boost.contract.toLowerCase() : "unknown"

      if (!contractMap[key]) {
        contractMap[key] = {
          contract: key,
          boosts: 0,
          whales: 0,
          totalAmount: 0,
          score: 0,
          lastBoost: boost.createdAt
        }
      }

      const hoursOld =
        (now.getTime() - new Date(boost.createdAt).getTime()) /
        (1000 * 60 * 60)

      const decay = Math.pow(hoursOld + 2, 1.5)

      const amount = Number(boost.amount)

      let score = amount

      if (boost.whale) {
        score = score * 3
      }

      const weightedScore = score / decay

      contractMap[key].boosts += 1
      contractMap[key].totalAmount += amount
      contractMap[key].score += weightedScore

      if (boost.whale) {
        contractMap[key].whales += 1
        contractMap[key].score += 2
      }

      if (boost.createdAt > contractMap[key].lastBoost) {
        contractMap[key].lastBoost = boost.createdAt
      }

    }

    const ranked = Object.values(contractMap)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 20)

    return NextResponse.json({
      success: true,
      tokens: ranked
    })

  } catch (err) {

    console.error("TRENDING ERROR:", err)

    return NextResponse.json(
      { error: "Trending error" },
      { status: 500 }
    )

  }
}
