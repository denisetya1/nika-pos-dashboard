import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";
import { verifyJwt } from "@/app/lib/jwt";

export const POST = async (req: NextRequest) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    // const body = await req.json()
    // const {1} = body

    // const count = await prisma.device.count({
    //   where:{
    //     storeId: userData.
    //   }
    // })
    // const device = await prisma.device.create({
    //   data: {
    //    userId: userData.id,
    //    isActive: true
    //   }
    // })

    return NextResponse.json({});

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "unathorized"
    }, {
      status: 401
    });
  }
}