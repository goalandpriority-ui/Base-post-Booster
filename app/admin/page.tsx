export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"

export default async function Admin() {

  const boosts = await prisma.boost.findMany({
    orderBy: { createdAt: "desc" }
  })

  const totalBoosts = await prisma.boost.count()

  const revenueAgg = await prisma.boost.aggregate({
    _sum: { amount: true }
  })

  const topWallet = await prisma.boost.groupBy({
    by: ["wallet"],
    _count: { wallet: true },
    orderBy: { _count: { wallet: "desc" } },
    take: 1
  })

  const topToken = await prisma.boost.groupBy({
    by: ["contract"],
    _count: { contract: true },
    orderBy: { _count: { contract: "desc" } },
    take: 1
  })

  const totalRevenue = Number(revenueAgg._sum.amount || 0)

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Total Boosts</p>
          <p className="text-xl font-bold">{totalBoosts}</p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold">
            {totalRevenue.toFixed(6)} ETH
          </p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Top Wallet</p>
          <p className="text-xs break-all">
            {topWallet[0]?.wallet || "N/A"}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Top Token</p>
          <p className="text-xs break-all">
            {topToken[0]?.contract || "N/A"}
          </p>
        </div>

      </div>

      {/* BOOST LIST */}

      <h2 className="text-xl font-semibold mb-4">
        Recent Boosts
      </h2>

      {boosts.map((b) => (
        <div key={b.id} className="border p-3 mb-2 rounded">

          <p>
            <strong>Wallet:</strong> {b.wallet}
          </p>

          <p>
            <strong>Post:</strong> {b.postUrl}
          </p>

          <p>
            <strong>Amount:</strong>{" "}
            {Number(b.amount).toFixed(6)} ETH
          </p>

          <p>
            <strong>Tx:</strong> {b.txHash}
          </p>

        </div>
      ))}

    </div>
  )
}
