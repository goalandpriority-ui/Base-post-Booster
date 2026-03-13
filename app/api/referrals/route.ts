import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req:Request){

const body = await req.json()

const boosts = await prisma.boost.findMany({
where:{
referrer:body.wallet
}
})

let total = 0

boosts.forEach(b=>{
total+=b.amount
})

return NextResponse.json({
count:boosts.length,
earned:total*0.05
})

}
