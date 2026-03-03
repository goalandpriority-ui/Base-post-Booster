import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const boosts = await prisma.boost.findMany({
    orderBy: { createdAt: "desc" },
    take: 25, // ✅ last 25 boosted posts
  })

  const formatted = boosts.map((b, index) => ({
    id: index + 1,
    content: b.postUrl,
    boost_count: b.amount,
    user_handle: b.wallet.slice(0, 6) + "...",
  }))

  return NextResponse.json(formatted)
}
