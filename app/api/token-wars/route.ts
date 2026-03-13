import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

try {

const boosts = await prisma.boost.findMany({
  where: {
    contract: {
      not: "unknown"
    }
  }
})

const map: any = {}

for (const boost of boosts) {

  if (!map[boost.contract]) {

    map[boost.contract] = {
      contract: boost.contract,
      name: boost.contract.slice(0,6),
      symbol: "TOKEN",
      marketCap: 0,
      boosts: 0
    }

  }

  map[boost.contract].boosts += 1

}

const result = Object.values(map)
  .sort((a: any, b: any) => b.boosts - a.boosts)
  .slice(0, 20)

return NextResponse.json(result)

} catch (err) {

console.error(err)

return NextResponse.json(
  { error: "wars failed" },
  { status: 500 }
)

}

}
