import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

try {

const referrals = await prisma.boost.groupBy({
  by: ["referrer"],
  _count: {
    referrer: true
  },
  _sum: {
    referralReward: true
  },
  where: {
    referrer: {
      not: null
    }
  },
  orderBy: {
    _count: {
      referrer: "desc"
    }
  },
  take: 20
})

const leaderboard = referrals.map((r, index) => {

  const earnings = Number(
    r._sum.referralReward?.toString() || "0"
  )

  return {
    rank: index + 1,
    wallet: r.referrer,
    totalBoosts: r._count.referrer,
    earnings
  }

})

return NextResponse.json(leaderboard)

} catch (error) {

console.error("REFERRAL LEADERBOARD ERROR:", error)

return NextResponse.json(
  { error: "Failed to load leaderboard" },
  { status: 500 }
)

}

}
