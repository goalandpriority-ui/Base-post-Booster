import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

  try {

    const boosts = await prisma.boost.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 30
    })

    return NextResponse.json(boosts)

  } catch (error) {

    console.error("LIVE BOOST ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load boosts" },
      { status: 500 }
    )

  }

}
