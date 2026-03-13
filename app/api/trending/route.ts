import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {

  try {

    const boosts = await prisma.boost.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

    const posts: any = {}

    boosts.forEach((b) => {

      if (!posts[b.postUrl]) {

        posts[b.postUrl] = {
          id: b.postUrl,
          content: b.postUrl,
          contract: b.contract,
          boost_count: 0
        }

      }

      posts[b.postUrl].boost_count += 1

    })

    const result = Object.values(posts)

    result.sort((a: any, b: any) => b.boost_count - a.boost_count)

    return NextResponse.json(result.slice(0, 20))

  } catch (error) {

    console.error("TRENDING ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch trending posts" },
      { status: 500 }
    )

  }

}
