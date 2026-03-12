import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {

    const posts = await prisma.boost.groupBy({
      by: ["postUrl", "contract"],
      _count: {
        postUrl: true,
      },
      orderBy: {
        _count: {
          postUrl: "desc",
        },
      },
    })

    const formatted = posts.map((post, index) => ({
      id: `${index}-${post.postUrl}`,
      content: post.postUrl,
      contract: post.contract,
      boost_count: post._count.postUrl,
    }))

    return NextResponse.json(formatted)

  } catch (error) {

    console.error("POSTS API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
