import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  try {

    const posts = await prisma.boost.groupBy({
      by: ["postUrl"],
      _sum: {
        amount: true,
      },
      _count: {
        postUrl: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 20,
    })

    return NextResponse.json(posts)

  } catch (error) {

    console.error("TRENDING ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch trending posts" },
      { status: 500 }
    )
  }
}
