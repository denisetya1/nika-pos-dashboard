import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../client";
import { verifyJwt } from "@/app/lib/jwt";
import moment from "moment";

export const GET = async (req: NextRequest, {params} : { params: {
  outletId: string,
  transactionId: string
}}) =>  {
  const { transactionId } = params;
  
  const transactions = await prisma.transaction.findMany({
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
    data: transactions
  });

  // } else {
  //   return NextResponse.json({
  //     code: "UNATHORIZED",
  //     message: "Unathorized Error!",
  //     data: null
  //   }, {
  //     status: 401
  //   });
  // }
}