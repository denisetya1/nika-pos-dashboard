import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../client";
import moment from "moment";


export const GET = async (req: NextRequest) =>  {
  const outletId = req.nextUrl.searchParams.get('outletId');
  const date = req.nextUrl.searchParams.get('date') || moment().format('YYYY-MM-DD');

  const startDate = new Date(date)
  const endDate = new Date(`${moment(date).add(1, "day").format('YYYY-MM-DD')} 07:00:00`)

  const products = await prisma.transactionDetail.groupBy({
    where: {
      transaction: {
        outletId: Number(outletId),
        transactionTime: {
          gte: startDate,
          lte: endDate
        }
      }
    },
    by: ['productStockId','name', 'barcode'],
    _sum: {
      qty: true
    },
  })

  return NextResponse.json(products);
}
