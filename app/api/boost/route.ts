import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const boost = await prisma.boost.create({
    data: body
  })

  return NextResponse.json(boost)
}

export async function GET() {
  const boosts = await prisma.boost.findMany({
    orderBy: { amount: "desc" }
  })

  return NextResponse.json(boosts)
}
