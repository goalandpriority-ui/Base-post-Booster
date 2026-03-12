import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.wallet || !body.postUrl || !body.txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const boost = await prisma.boost.create({
      data: {
        wallet: String(body.wallet),
        postUrl: String(body.postUrl),

        // ✅ SAFE CONTRACT VALUE
        contract: body.contract ? String(body.contract) : "",

        txHash: String(body.txHash),

        // ✅ SAFE NUMBER CONVERSION
        amount: Number(body.amount),
      },
    })

    return NextResponse.json(boost)
  } catch (error) {
    console.error("SAVE BOOST ERROR:", error)

    return NextResponse.json(
      { error: "Failed to save boost" },
      { status: 500 }
    )
  }
}
