import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";

export const GET = async (req: NextRequest, {params}: {params: {
  outletId: string
}}) =>  {
  const { outletId } = params;

  const paymentList = await prisma.outletPaymentType.findMany({
    where: {
      storeId: 1,
      outletId: Number(outletId)
    }
  });

  return NextResponse.json(paymentList);
}

export const POST = async (request: Request, {params}: {params: {
  outletId: string
}}) =>  {
  const { outletId } = params;
  const body = await request.json()

  const outletPaymentType = await prisma.outletPaymentType.create({
    data: {
      outletId: Number(outletId),
      storeId: 1,
      paymentTypeId: Number(body.PaymentTypeId),
      isActive: true
    }
  })

  return NextResponse.json(outletPaymentType);
}
