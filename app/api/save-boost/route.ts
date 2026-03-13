export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createPublicClient, http, parseEther } from "viem"
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
const contract = body.contract ? String(body.contract) : null
const txHash = String(body.txHash || "")
const amount = parseFloat(body.amount || "0")

/* NEW REFERRAL FIELD */
const referrer = body.referrer ? String(body.referrer) : null

if (!wallet || !postUrl || !txHash) {
  return NextResponse.json(
    { error: "Missing required fields" },
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

// prevent duplicate transaction
const existing = await prisma.boost.findUnique({
  where: { txHash },
})

if (existing) {
  return NextResponse.json(
    { error: "Transaction already used" },
    { status: 400 }
  )
}

// check receipt
const receipt = await client.getTransactionReceipt({
  hash: txHash as `0x${string}`,
})

if (!receipt || receipt.status !== "success") {
  return NextResponse.json(
    { error: "Transaction not successful" },
    { status: 400 }
  )
}

// get transaction
const tx = await client.getTransaction({
  hash: txHash as `0x${string}`,
})

if (!tx.to || tx.to.toLowerCase() !== YOUR_WALLET_ADDRESS.toLowerCase()) {
  return NextResponse.json(
    { error: "Invalid payment receiver" },
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

// SAVE BOOST (WITH REFERRAL)
const boost = await prisma.boost.create({
  data: {
    wallet,
    postUrl,
    contract,
    txHash,
    amount,
    referrer: validReferrer
  },
})

console.log("BOOST SAVED:", boost)

return NextResponse.json({
  success: true,
  boost,
})

} catch (error) {

console.error("SAVE BOOST ERROR:", error)

return NextResponse.json(
  { error: "Failed to save boost" },
  { status: 500 }
)

}
}
