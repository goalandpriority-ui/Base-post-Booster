import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {

  try {

    const boosts = await prisma.boost.findMany({
      select: {
        id: true,
        wallet: true,
        postUrl: true,
        contract: true,
        amount: true,
        txHash: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20
    })

    return NextResponse.json(boosts)

  } catch (err) {

    console.error("BOOSTS ERROR:", err)

    return NextResponse.json(
      { error: "Boost fetch error" },
      { status: 500 }
    )

  }

}
