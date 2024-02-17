import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../client";

export const POST = async (request: NextRequest, {params}: {params: {
  outletId: string,
}}) =>  {
  const { outletId } = params;
  const body = await request.json()

  const outletPaymentMethod = await prisma.outletPaymentMethod.upsert({
    where: {
      storeId_outletId_paymentMethodId: {
        storeId: 1,
        outletId: Number(outletId),
        paymentMethodId: Number(body.paymentMethodId)
      }
    },
    update: {
      isActive: body.isActive,
    },
    create: {
      storeId: 1,
      paymentMethodId: body.paymentMethodId,
      isActive: body.isActive,
      outletId: Number(outletId)
    }
  })

  return NextResponse.json(outletPaymentMethod);
}