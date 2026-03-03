import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const leaderboard = await prisma.boost.groupBy({
      by: ["postUrl", "contract"],
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    })

    const formatted = leaderboard.map((item, index) => ({
      id: index + 1,
      content: item.postUrl,
      contract: item.contract,
      boost_count: item._sum.amount ?? 0,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
