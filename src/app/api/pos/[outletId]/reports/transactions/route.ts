import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../client";
import { isEmptyVal } from "@/app/helpers/functions";
import { verifyJwt } from "@/app/lib/jwt";
import moment from "moment";

export const GET = async (req: NextRequest, {params} : { params: {
  outletId: string
}}) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const transactions = await prisma.transaction.findMany({
      where: {
        outletId: parseInt(params.outletId),
        transactionTime: {
          lte: new Date(moment().format('DD-MM-YYYY 23:59:59')),
          gte: new Date(moment().format('DD-MM-YYYY 00:00:00'))
        }
      }, 
      include: {
        transactionDetails: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        transactionTime: 'asc'
      }
    })

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: transactions
    }, {
      status: 401
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