import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {

try {

const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

const boosts = await prisma.boost.findMany({
where: {
createdAt: {
gte: tenMinutesAgo
}
},
orderBy: {
createdAt: "desc"
}
})

const contracts: Record<string, any> = {}

for (const boost of boosts) {

const contract = boost.contract || "unknown"

if (!contracts[contract]) {
contracts[contract] = {
boosts: 0,
wallets: new Set(),
posts: new Set(),
whale: false
}
}

contracts[contract].boosts += 1
contracts[contract].wallets.add(boost.wallet)
contracts[contract].posts.add(boost.postUrl)

if (boost.whale) {
contracts[contract].whale = true
}

}

const results: any[] = []

for (const contract in contracts) {

const data = contracts[contract]

const boostCount = data.boosts
const walletCount = data.wallets.size
const postCount = data.posts.size
const whale = data.whale

let score = 0

score += boostCount * 2
score += walletCount * 3
score += postCount * 2

if (whale) score += 10

let status = "normal"

if (score > 60) status = "trending"
else if (score > 40) status = "hot"
else if (score > 20) status = "pumping"

results.push({
contract,
boosts: boostCount,
wallets: walletCount,
posts: postCount,
whale,
score,
status
})

}

results.sort((a,b)=>b.score-a.score)

return NextResponse.json({
success: true,
data: results.slice(0,20)
})

} catch (error) {

console.error("PUMP DETECTION ERROR",error)

return NextResponse.json(
{ error: "Pump detection failed" },
{ status: 500 }
)

}

}
