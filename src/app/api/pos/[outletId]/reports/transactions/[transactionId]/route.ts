import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../client";
import { verifyJwt } from "@/app/lib/jwt";
import moment from "moment";

export const GET = async (req: NextRequest, {params} : { params: {
  outletId: string,
  transactionId: string
}}) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const { transactionId } = params;
    
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId
      },
      orderBy: {
        transactionTime: 'asc'
      },
      include: {
        user: true,
        userShift: {
          include: {
            shift: true
          }
        },
        transactionDetails: true,
        outlet: true,
        outletPaymentMethod: {
          include: {
            paymentMethod: true
          }
        }
      }
    })

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: transaction
    });

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "Unathorized Error!",
      data: null
    }, {
      status: 401
    });
  }
}