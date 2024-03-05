import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";

export const GET = async (req: NextRequest, {params} : { params: {
  outletId: string
}}) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const { outletId } = params;

    const outletPayments = await prisma.outletPaymentMethod.findMany({
      where: {
        AND : [
          {storeId: 1},
          {outletId: Number(outletId)},
          {isActive: true}
        ]
      },
      orderBy: {
        id: 'asc'
      },
      include: {
        paymentMethod: {
          select: {
            id: true,
            name: true,
            displayName: true
          }
        }
      }
    })

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: outletPayments
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