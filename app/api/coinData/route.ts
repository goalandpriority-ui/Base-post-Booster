import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const { contract } = await req.json()

    if (!contract) {
      return NextResponse.json({ error: "No contract" })
    }

    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${contract}`
    )

    const data = await res.json()

    const pair = data.pairs?.[0]

    if (!pair) {
      return NextResponse.json({ error: "No data found" })
    }

    return NextResponse.json({
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      price: pair.priceUsd,
      marketcap: pair.marketCap,
      volume24h: pair.volume.h24,
      liquidity: pair.liquidity.usd,
      chart: pair.url
    })

  } catch (err) {

    return NextResponse.json({
      error: "Coin fetch failed"
    })

  }
}
