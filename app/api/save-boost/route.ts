import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const boost = await prisma.boost.create({
      data: {
        wallet: body.wallet,
        postUrl: body.postUrl,
        contract: body.contract,
        txHash: body.txHash,
        amount: body.amount,
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
