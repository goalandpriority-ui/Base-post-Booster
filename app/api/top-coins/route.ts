import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(){

  try{

    const coins = await prisma.boost.groupBy({
      by:["contract"],
      _count:{contract:true},
      orderBy:{
        _count:{
          contract:"desc"
        }
      },
      take:10
    })

    return NextResponse.json(coins)

  }catch(err){

    return NextResponse.json(
      {error:"Failed"},
      {status:500}
    )
  }

}
