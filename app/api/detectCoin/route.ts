import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {

try {

const body = await req.json()

const link = body.link

if (!link) {
  return NextResponse.json(
    { error: "No link provided" },
    { status: 400 }
  )
}

/* SUPPORT MULTIPLE FARCASTER LINKS */

if (
  !link.includes("warpcast.com") &&
  !link.includes("farcaster.xyz") &&
  !link.includes("/content/")
) {
  return NextResponse.json(
    { error: "Invalid Farcaster link" },
    { status: 400 }
  )
}

/* EXTRACT BASE64 CONTENT */

let encoded = ""

if (link.includes("/content/")) {
  encoded = link.split("/content/")[1]
}

if (!encoded) {
  return NextResponse.json({
    contract: null,
    decoded: null
  })
}

/* BASE64 DECODE */

const decoded = Buffer.from(encoded, "base64").toString("utf8")

/* FIND CONTRACT ADDRESS */

const match = decoded.match(/0x[a-fA-F0-9]{40}/)

if (!match) {

  return NextResponse.json({
    contract: null,
    decoded
  })

}

const contract = match[0]

return NextResponse.json({
  contract,
  decoded
})

} catch (error) {

console.error("DETECT COIN ERROR:", error)

return NextResponse.json(
  { error: "Decode failed" },
  { status: 500 }
)

}

}
