import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../client";
import { verifyJwt } from "@/app/lib/jwt";
import moment from "moment";

export const POST = async (req: NextRequest, {params} : { params: {
  outletId: string
}}) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const body = await req.json()
    const {shiftId, capital, userId} = body

    let userShift = await prisma.userShift.findFirst({
      where:{
        shiftId: Number(shiftId),
        userId,
        startDateTime: {
          gte: new Date(moment().format("yyyy-MM-DD")),
        }
      }
    })

    if(!userShift) {
      userShift = await prisma.userShift.create({
        data: {
          shiftId: Number(shiftId),
          userId,
          capital: Number(capital),
          startDateTime: new Date()
        }
      })
    }

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: userShift
    });

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "Unathorized Error!"
    }, {
      status: 401
    });
  }
}