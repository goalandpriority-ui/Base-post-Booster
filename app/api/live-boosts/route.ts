export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  try {

    const boosts = await prisma.boost.findMany({

      select: {
        id: true,
        wallet: true,
        postUrl: true,
        contract: true,
        amount: true,
        whale: true,
        txHash: true,
        createdAt: true
      },

      orderBy: {
        createdAt: "desc"
      },

      take: 20

    })

    const formatted = boosts.map((b) => {

      const wallet = b.wallet.toLowerCase()

      return {

        id: b.id,

        wallet,

        walletShort:
        `${wallet.slice(0,6)}...${wallet.slice(-4)}`,

        postUrl: b.postUrl,

        contract: b.contract,

        amount: Number(b.amount),

        whale: b.whale,

        txHash: b.txHash,

        createdAt: b.createdAt

      }

    })

    return NextResponse.json(formatted)

  } catch (err) {

    console.error("LIVE BOOST ERROR:", err)

    return NextResponse.json(
      { error: "Live feed error" },
      { status: 500 }
    )

  }

}
