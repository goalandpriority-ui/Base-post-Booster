import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const contract = body.contract

    if (!contract) {

      return NextResponse.json(
        { error: "No contract provided" },
        { status: 400 }
      )

    }

    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${contract}`
    )

    const data = await res.json()

    const pair = data.pairs?.[0]

    if (!pair) {

      return NextResponse.json(
        { error: "Token not found" },
        { status: 404 }
      )

    }

    return NextResponse.json({

      name: pair.baseToken.name,

      symbol: pair.baseToken.symbol,

      price: pair.priceUsd,

      marketCap: pair.fdv

    })

  } catch (error) {

    console.error("COIN DATA ERROR:", error)

    return NextResponse.json(
      { error: "Coin fetch failed" },
      { status: 500 }
    )

  }

}
