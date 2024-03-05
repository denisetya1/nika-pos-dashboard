import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import moment from "moment";


export const GET = async (req: NextRequest) =>  {
  const outletId = req.nextUrl.searchParams.get('outletId');
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

  return NextResponse.json(transactions);
}
