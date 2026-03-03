import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const leaderboard = await prisma.boost.groupBy({
    by: ["postUrl", "contract"],
    _sum: { amount: true },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
    take: 25,
  })

  const formatted = leaderboard.map((item, index) => ({
    id: index + 1,
    content: item.postUrl,
    boost_count: item._sum.amount,
    contract: item.contract,
  }))

  return NextResponse.json(formatted)
}
