import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../client";

export const POST = async (request: NextRequest, {params}: {params: {
  outletId: string,
}}) =>  {
  const { outletId } = params;
  const body = await request.json()

  const outletPaymentType = await prisma.outletPaymentType.upsert({
    where: {
      storeId_outletId_paymentTypeId: {
        storeId: 1,
        outletId: Number(outletId),
        paymentTypeId: body.paymentTypeId 
      }
    },
    update: {
      isActive: body.isActive,
    },
    create: {
      storeId: 1,
      paymentTypeId: body.paymentTypeId,
      isActive: body.isActive,
      outletId: Number(outletId)
    }
  })

  return NextResponse.json(outletPaymentType);
}