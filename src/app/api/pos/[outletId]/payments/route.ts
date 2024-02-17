import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";

export const GET = async (req: NextRequest, {params} : { params: {
  outletId: string
}}) =>  {
  // const accessToken = req.headers.get('authorization')

  if(true) {//accessToken && verifyJwt(accessToken)) {
    const { outletId } = params;

    const outletPayments = await prisma.outletPaymentType.findMany({
      where: {
        AND : [
          {storeId: 1},
          {outletId: Number(outletId)},
        ]
      },
      orderBy: {
        id: 'asc'
      },
      include: {
        paymentType: {
          select: {
            id: true,
            name: true,
            displayName: true
          }
        }
      }
    })

    return NextResponse.json(outletPayments);

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "unathorized"
    }, {
      status: 401
    });
  }
}