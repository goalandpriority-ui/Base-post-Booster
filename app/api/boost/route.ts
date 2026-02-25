import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const body = await req.json()

  const boost = await prisma.boost.create({
    data: {
      wallet: body.wallet,
      postUrl: body.postUrl,
      txHash: body.txHash,
      amount: body.amount
    }
  })

  return NextResponse.json(boost)
}
