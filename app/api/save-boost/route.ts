import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()

    await prisma.boost.create({
      data: {
        wallet: body.wallet,
        postUrl: body.postUrl,
        txHash: body.txHash,
        amount: body.amount,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
