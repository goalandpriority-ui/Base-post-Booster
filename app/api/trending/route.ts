import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

const boosts = await prisma.boost.findMany()

const posts: any = {}

boosts.forEach((b)=>{

if(!posts[b.postUrl]){

posts[b.postUrl] = {
postUrl:b.postUrl,
total:0,
count:0,
latest:b.createdAt
}

}

posts[b.postUrl].total += b.amount
posts[b.postUrl].count += 1

})

const result = Object.values(posts).map((p:any)=>{

const hoursOld =
(Date.now() - new Date(p.latest).getTime()) / 3600000

const score =
p.total * 100 + p.count * 10 - hoursOld

return {...p,score}

})

result.sort((a,b)=>b.score-a.score)

return NextResponse.json(result.slice(0,20))

}
