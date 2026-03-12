import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const boosts = await prisma.boost.findMany()

    const map: Record<string, any> = {}

    boosts.forEach((b) => {
      if (!map[b.postUrl]) {
        map[b.postUrl] = {
          id: b.postUrl, // ✅ FIX: stable ID
          content: b.postUrl,
          contract: b.contract,
          boost_count: 1,
        }
      } else {
        map[b.postUrl].boost_count += 1
      }
    })

    const posts = Object.values(map)

    return NextResponse.json(posts)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
