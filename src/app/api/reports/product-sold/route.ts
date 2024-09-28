import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import moment from "moment";


export const GET = async (req: NextRequest) =>  {
  const outletId = req.nextUrl.searchParams.get('outletId');
  const sDate = req.nextUrl.searchParams.get('startDate') || moment().format('YYYY-MM-DD');
  const eDate = req.nextUrl.searchParams.get('endDate') || moment().format('YYYY-MM-DD');
  const search = req.nextUrl.searchParams.get("search") || '';

  const startDate = new Date(sDate)
  const endDate = new Date(`${moment(eDate).add(1, "day").format('YYYY-MM-DD')} 07:00:00`)

  const products = await prisma.transactionDetail.groupBy({
    where: {
      ...(search !== '' ? {name: {contains: search}} : {}),
      transaction: {
        outletId: Number(outletId),
        transactionTime: {
          gte: startDate,
          lte: endDate
        }
      }
    },
    by: ['productStockId','name', 'barcode', 'finalSellPrice'],
    _sum: {
      qty: true
    },
  })

  return NextResponse.json(products);
}
