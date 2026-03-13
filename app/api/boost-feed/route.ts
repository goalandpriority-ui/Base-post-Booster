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
        txHash: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    const feed = boosts.map((b) => {

      const amount = Number(b.amount || 0)

      let boostType = "normal"

      if (amount >= 0.1) boostType = "mega"
      else if (amount >= 0.05) boostType = "whale"

      return {
        id: b.id,

        wallet: b.wallet,
        walletShort: b.wallet
          ? `${b.wallet.slice(0,6)}...${b.wallet.slice(-4)}`
          : "unknown",

        postUrl: b.postUrl,

        contract: b.contract,
        contractShort: b.contract
          ? `${b.contract.slice(0,6)}...${b.contract.slice(-4)}`
          : "unknown",

        amount: amount,

        txHash: b.txHash,

        createdAt: b.createdAt,

        boostType: boostType
      }

    })

    return NextResponse.json(feed)

  } catch (error) {

    console.error("BOOST FEED ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch boost feed" },
      { status: 500 }
    )

  }

}
