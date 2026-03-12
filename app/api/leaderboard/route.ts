import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {

    const leaderboard = await prisma.boost.groupBy({
      by: ["wallet"],
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 10,
    })

    return NextResponse.json(leaderboard)

  } catch (error) {
    console.error("LEADERBOARD ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
