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
    const amount = parseFloat(body.amount || "0")
    const referrer = body.referrer ? String(body.referrer) : null

    /* REQUIRED FIELD CHECK */

    if (!wallet || !postUrl || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    /* WALLET VALIDATION */

    if (!isAddress(wallet)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      )
    }

    if (contract && !isAddress(contract)) {
      return NextResponse.json(
        { error: "Invalid contract address" },
        { status: 400 }
      )
    }

    /* PREVENT SELF REFERRAL */

    let validReferrer = referrer

    if (
      validReferrer &&
      validReferrer.toLowerCase() === wallet.toLowerCase()
    ) {
      validReferrer = null
    }

    /* DUPLICATE CHECK */

    const existing = await prisma.boost.findUnique({
      where: { txHash }
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Transaction already processed"
      })
    }

    /* VERIFY TRANSACTION RECEIPT */

    const receipt = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`
    })

    if (!receipt || receipt.status !== "success") {
      return NextResponse.json(
        { error: "Transaction not successful" },
        { status: 400 }
      )
    }

    /* FETCH TRANSACTION */

    const tx = await client.getTransaction({
      hash: txHash as `0x${string}`
    })

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found"
