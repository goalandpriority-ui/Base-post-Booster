import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  try {

    const now = Date.now()

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
        hoursOld = (now - new Date(latestBoost).getTime()) / 3600000
      }

      // Prisma Decimal → Number conversion
      const totalAmount = Number(post._sum.amount || 0)

      // Boost count
      const boostCount = post._count.postUrl

      // Whale detection
      const whaleBoost = totalAmount >= 0.05 ? 5 : 0

      // Reddit-style decay
      const decay = Math.pow(hoursOld + 2, 1.5)

      // Final ranking score
      const trendingScore =
        ((boostCount * 10) + (totalAmount * 120) + whaleBoost) / decay

      return {
        id: `${index}-${post.postUrl}`,
        content: post.postUrl,
        contract: post.contract,
        boost_count: boostCount,
        total_boost_eth: totalAmount,
        latest_boost: latestBoost,
        hours_old: hoursOld,
        score: trendingScore,
      }

    })

    // Sort by score
    const ranked = formatted
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)

    return NextResponse.json(ranked)

  } catch (error) {

    console.error("POSTS API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )

  }

      }
