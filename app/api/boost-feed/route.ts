import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const boosts = await prisma.boost.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    })

    return NextResponse.json(boosts)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 })
  }
}
