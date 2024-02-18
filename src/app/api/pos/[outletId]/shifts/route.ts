import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";
import { verifyJwt } from "@/app/lib/jwt";

export const GET = async (req: NextRequest, {params} : { params: {
  outletId: string
}}) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const { outletId } = params;

    const openedShift = await prisma.dailyShift.findFirst({
      where: {
        userId: userData.id,
        endDateTime: null
      }
    });

    let shifts = await prisma.shift.findMany({
      where: {
        outletId: Number(outletId),
        isActive: true
      },
      select:{
        id: true,
        name: true,
        workingHours: true,
        isActive: true
      }
    })

    shifts = shifts.map((shift) => {
      return {
        ...shift,
        isOpen: openedShift && openedShift.id === shift.id ? true : false
      }
    })

    return NextResponse.json(shifts);

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "unathorized"
    }, {
      status: 401
    });
  }
}