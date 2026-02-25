export const dynamic = "force-dynamic"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
          <p>Amount: {b.amount} ETH</p>
          <p>Tx: {b.txHash}</p>
        </div>
      ))}
    </div>
  )
}
