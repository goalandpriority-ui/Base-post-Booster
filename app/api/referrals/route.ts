import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const wallet = searchParams.get("wallet")

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet required" },
        { status: 400 }
      )
    }

    const referrals = await prisma.boost.findMany({
      where: {
        referrer: wallet
      }
    })

    const totalBoosts = referrals.length

    // Convert Prisma Decimal → Number
    const totalVolume = referrals.reduce((sum, r) => {
      const amount = Number(r.amount || 0)
      return sum + amount
    }, 0)

    // 10% referral earnings
    const earnings = totalVolume * 0.1

    return NextResponse.json({
      wallet,
      totalBoosts,
      totalVolume,
      earnings
    })

  } catch (error) {

    console.error("REFERRAL API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load referrals" },
      { status: 500 }
    )

  }

}
