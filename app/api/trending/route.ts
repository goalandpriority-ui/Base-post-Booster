import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const last72 = new Date(Date.now() - 72 * 60 * 60 * 1000)

    const data = await prisma.boost.groupBy({
      by: ["contract"],
      where: {
        createdAt: {
          gte: last72
        }
      },
      _count: {
        contract: true
      },
      _sum: {
        amount: true
      }
    })

    const ranked = data
      .map((item) => ({
        contract: item.contract,
        boosts: item._count.contract,
        totalAmount: Number(item._sum.amount || 0),
        score: item._count.contract * 2 + Number(item._sum.amount || 0)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)

    return NextResponse.json(ranked)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Trending error" }, { status: 500 })
  }
}
