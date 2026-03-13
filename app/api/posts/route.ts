import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  try {

    const posts = await prisma.boost.groupBy({
      by: ["postUrl", "contract"],
      _count: {
        postUrl: true,
      },
      _sum: {
        amount: true,
      },
      _max: {
        createdAt: true,
      },
      orderBy: {
        _count: {
          postUrl: "desc",
        },
      },
    })

    const formatted = posts.map((post, index) => {

      const latestBoost = post._max.createdAt

      let hoursOld = 0

      if (latestBoost) {
        hoursOld =
          (Date.now() - new Date(latestBoost).getTime()) / 3600000
      }

      const trendingScore =
        (post._count.postUrl * 10) +
        ((post._sum.amount || 0) * 100) -
        hoursOld

      return {
        id: `${index}-${post.postUrl}`,
        content: post.postUrl,
        contract: post.contract,
        boost_count: post._count.postUrl,
        total_boost_eth: post._sum.amount || 0,
        latest_boost: latestBoost,
        score: trendingScore,
      }

    })

    return NextResponse.json(formatted)

  } catch (error) {

    console.error("POSTS API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )

  }

}
