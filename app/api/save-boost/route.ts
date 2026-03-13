export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createPublicClient, http, parseEther, isAddress } from "viem"
import { base } from "viem/chains"

const YOUR_WALLET_ADDRESS = "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2"

const client = createPublicClient({
  chain: base,
  transport: http(),
})

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const wallet = String(body.wallet || "")
    const postUrl = String(body.postUrl || "")
    const contract = body.contract ? String(body.contract) : ""
    const txHash = String(body.txHash || "")
    const amount = Number(body.amount || 0)
    const plan = String(body.plan || "basic")

    const referrer = body.referrer ? String(body.referrer) : null

    if (!wallet || !postUrl || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!isAddress(wallet)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      )
    }

    let validReferrer = referrer

    if (
      validReferrer &&
      validReferrer.toLowerCase() === wallet.toLowerCase()
    ) {
      validReferrer = null
    }

    const existing = await prisma.boost.findUnique({
      where: { txHash }
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Transaction already processed"
      })
    }

    const receipt = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`
    })

    if (!receipt || receipt.status !== "success") {
      return NextResponse.json(
        { error: "Transaction not successful" },
        { status: 400 }
      )
    }

    const tx = await client.getTransaction({
      hash: txHash as `0x${string}`
    })

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 400 }
      )
    }

    if (!tx.to || tx.to.toLowerCase() !== YOUR_WALLET_ADDRESS.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid payment receiver" },
        { status: 400 }
      )
    }

    if (tx.from.toLowerCase() !== wallet.toLowerCase()) {
      return NextResponse.json(
        { error: "Wallet does not match sender" },
        { status: 400 }
      )
    }

    const minPayment = parseEther("0.00001")

    if (tx.value < minPayment) {
      return NextResponse.json(
        { error: "Insufficient payment" },
        { status: 400 }
      )
    }

    // -----------------------------
    // Anti Spam Protection
    // -----------------------------

    const lastHour = new Date(Date.now() - 60 * 60 * 1000)

    const walletBoostCount = await prisma.boost.count({
      where: {
        wallet,
        createdAt: { gte: lastHour }
      }
    })

    if (walletBoostCount >= 5) {
      return NextResponse.json(
        { error: "Boost limit reached. Try later." },
        { status: 429 }
      )
    }

    const postBoostCount = await prisma.boost.count({
      where: {
        postUrl,
        createdAt: { gte: lastHour }
      }
    })

    if (postBoostCount >= 3) {
      return NextResponse.json(
        { error: "Post boost limit reached." },
        { status: 429 }
      )
    }

    // -----------------------------
    // Plan Logic
    // -----------------------------

    let durationHours = 24
    let weight = 1

    if (plan === "pro") {
      durationHours = 48
      weight = 1.5
    }

    if (plan === "elite") {
      durationHours = 72
      weight = 2
    }

    // -----------------------------
    // Whale Detection
    // -----------------------------

    const whale = amount >= 0.05

    // -----------------------------
    // Trending Score
    // -----------------------------

    let score = amount * weight

    if (whale) {
      score = score * 3
    }

    // -----------------------------
    // Save Boost
    // -----------------------------

    const boost = await prisma.boost.create({
      data: {
        wallet,
        postUrl,
        contract,
        txHash,
        amount,
        score,
        plan,
        durationHours,
        whale,
        referrer: validReferrer
      }
    })

    return NextResponse.json({
      success: true,
      boost
    })

  } catch (error) {

    console.error("SAVE BOOST ERROR:", error)

    return NextResponse.json(
      { error: "Failed to save boost" },
      { status: 500 }
    )

  }

}
