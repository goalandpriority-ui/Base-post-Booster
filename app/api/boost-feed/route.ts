import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {

    const boosts = await prisma.boost.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    })

    return NextResponse.json(boosts)

  } catch (error) {

    console.error("BOOST FEED ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch boost feed" },
      { status: 500 }
    )

  }
}
