export const dynamic = "force-dynamic"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function Leaderboard() {
  const leaderboard = await prisma.boost.groupBy({
    by: ["postUrl"],
    _sum: { amount: true },
    orderBy: {
      _sum: {
        amount: "desc"
      }
    }
  })

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Top Boosted Posts 🏆</h1>

      {leaderboard.map((item, index) => (
        <div key={index} className="border p-3 mb-2">
          <p>Post: {item.postUrl}</p>
          <p>Total Boost: {item._sum.amount} ETH</p>
        </div>
      ))}
    </div>
  )
}
