import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";
import moment from "moment";

export const GET = async (req: NextRequest, {params} : { params: {
  outletId: string
}}) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const { outletId } = params;
    const date = req.nextUrl.searchParams.get('date') || moment().format('YYYY-MM-DD');

    const startDate = new Date(date)
    const endDate = new Date(`${moment(date).add(1, "day").format('YYYY-MM-DD')} 07:00:00`)
    
    const transactions = await prisma.transaction.findMany({
      where: {
        outletId: Number(outletId),
        transactionTime: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        transactionTime: 'asc'
      },
      include: {
        user: {
          select:{
            id: true,
            name: true,
            username: true
          }
        },
        userShift: {
          select:{
            shift: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        outletPaymentMethod: {
          select: {
            paymentMethod: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: transactions
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