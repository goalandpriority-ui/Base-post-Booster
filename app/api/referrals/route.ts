export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const wallet = searchParams.get("wallet")?.toLowerCase()

    if (!wallet) {

      return NextResponse.json(
        { error: "Wallet required" },
        { status: 400 }
      )

    }

    const referrals = await prisma.boost.findMany({

      where: {
        referrer: wallet
      },

      select: {
        wallet: true,
        amount: true,
        referralReward: true,
        createdAt: true
      }

    })

    let totalVolume = 0
    let totalEarnings = 0

    for (const r of referrals) {

      totalVolume += Number(r.amount || 0)

      totalEarnings += Number(r.referralReward || 0)

    }

    return NextResponse.json({

      wallet,
      totalReferrals: referrals.length,
      totalVolume: Number(totalVolume.toFixed(6)),
      earnings: Number(totalEarnings.toFixed(6)),
      referrals

    })

  } catch (error) {

    console.error("REFERRAL API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load referrals" },
      { status: 500 }
    )

  }

}
