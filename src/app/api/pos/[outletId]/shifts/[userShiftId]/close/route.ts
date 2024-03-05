import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";

export const PATCH = async (req: NextRequest, {params} : { params: {
  outletId: string,
  userShiftId: string,
}}) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const {userShiftId} = params

    const userShift = await prisma.userShift.update({
      where: {
        id: Number(userShiftId),
      },
      data: {
        endDateTime: new Date()
      }
    })

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