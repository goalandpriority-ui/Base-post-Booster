export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createPublicClient, http, parseEther, isAddress, formatEther } from "viem"
import { base } from "viem/chains"

const YOUR_WALLET_ADDRESS = "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2"

const client = createPublicClient({
  chain: base,
  transport: http(),
})

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const wallet = String(body.wallet || "").toLowerCase()
    const postUrl = String(body.postUrl || "")
    const contract = body.contract ? String(body.contract).toLowerCase() : ""
    const txHash = String(body.txHash || "")
    const referrer = body.referrer ? String(body.referrer).toLowerCase() : null

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

    if (validReferrer && validReferrer === wallet) {
      validReferrer = null
    }

    // --------------------------------
    // Prevent duplicate transaction
    // --------------------------------

    const existing = await prisma.boost.findUnique({
      where: { txHash }
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Transaction already processed"
      })
    }

    // --------------------------------
    // Verify transaction receipt
    // --------------------------------

    const receipt = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`
    })

    if (!receipt || receipt.status !== "success") {
      return NextResponse.json(
        { error: "Transaction not successful" },
        { status: 400 }
      )
    }

    // --------------------------------
    // Get transaction
    // --------------------------------

    const tx = await client.getTransaction({
      hash: txHash as `0x${string}`
    })

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 400 }
      )
    }

    // --------------------------------
    // Verify receiver wallet
    // --------------------------------

    if (!tx.to || tx.to.toLowerCase() !== YOUR_WALLET_ADDRESS.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid payment receiver" },
        { status: 400 }
      )
    }

    // --------------------------------
    // Verify sender wallet
    // --------------------------------

    if (tx.from.toLowerCase() !== wallet) {
      return NextResponse.json(
        { error: "Wallet does not match sender" },
        { status: 400 }
      )
    }

    // --------------------------------
    // Convert payment amount
    // --------------------------------

    const paidEth = Number(formatEther(tx.value))

    const minPayment = 0.00001

    if (paidEth < minPayment) {
      return NextResponse.json(
        { error: "Insufficient payment" },
        { status: 400 }
      )
    }

    // --------------------------------
    // Detect Boost Plan
    // --------------------------------

    let plan = "basic"
    let durationHours = 24

    if (paidEth >= 0.005) {
      plan = "elite"
      durationHours = 72
    } else if (paidEth >= 0.003) {
      plan = "pro"
      durationHours = 48
    }

    // --------------------------------
    // Anti Spam Protection
    // --------------------------------

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

    // --------------------------------
    // Whale Detection
    // --------------------------------

    const whale = paidEth >= 0.05

    // --------------------------------
    // Save Boost
    // --------------------------------

    const boost = await prisma.boost.create({
      data: {
        wallet,
        postUrl,
        contract,
        txHash,
        amount: paidEth,
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
