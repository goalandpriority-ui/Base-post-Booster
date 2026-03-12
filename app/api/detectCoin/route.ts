import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { link } = await req.json()

    if (!link) {
      return NextResponse.json({ error: "No link provided" })
    }

    const encoded = link.split("/content/")[1]

    if (!encoded) {
      return NextResponse.json({ error: "Invalid Base link" })
    }

    const decoded = Buffer.from(encoded, "base64").toString("utf8")

    const match = decoded.match(/0x[a-fA-F0-9]{40}/)

    return NextResponse.json({
      contract: match ? match[0] : null,
      decoded
    })

  } catch (err) {
    return NextResponse.json({ error: "Decode failed" })
  }
}
