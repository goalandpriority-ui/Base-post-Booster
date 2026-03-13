import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {

  try {

    const tokens = await prisma.boost.groupBy({

      by: ["contract"],

      where: {
        contract: {
          not: ""
        }
      },

      _count: {
        contract: true
      },

      orderBy: {
        _count: {
          contract: "desc"
        }
      },

      take: 10

    })

    return NextResponse.json(tokens)

  } catch (error) {

    console.error("WAR API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load wars" },
      { status: 500 }
    )

  }

}
