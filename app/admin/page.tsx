export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"

export default async function Admin() {

  const boosts = await prisma.boost.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {boosts.map((b) => (
        <div key={b.id} className="border p-3 mb-2">
          <p>Wallet: {b.wallet}</p>
          <p>Post: {b.postUrl}</p>
          <p>Amount: {Number(b.amount).toFixed(6)} ETH</p>
          <p>Tx: {b.txHash}</p>
        </div>
      ))}
    </div>
  )
}
