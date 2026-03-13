import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {

try {

const result = await prisma.boost.groupBy({
  by: ["postUrl", "contract"],
  _count: {
    postUrl: true
  },
  orderBy: {
    _count: {
      postUrl: "desc"
    }
  },
  take: 20
})

const posts = result.map((r) => ({
  id: r.postUrl,
  content: r.postUrl,
  contract: r.contract,
  boost_count: r._count.postUrl
}))

return NextResponse.json(posts)

} catch (error) {

console.error("TRENDING ERROR:", error)

return NextResponse.json(
  { error: "Failed to fetch trending posts" },
  { status: 500 }
)

}

}
