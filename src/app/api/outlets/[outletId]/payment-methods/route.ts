import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";

export const GET = async (req: NextRequest, {params}: {params: {
  outletId: string,
}}) =>  {
  
  const { outletId } = params;
  const paymentMethods = await prisma.paymentMethod.findMany({
    where:{
      isActive: true,
    },
    include:{
      OutletPaymentMethods: {
        where: {
          outletId: Number(outletId)
        }
      }
    }
  })

  return NextResponse.json(paymentMethods)
}

export const POST = async (request: Request, {params}: {params: {
  outletId: string
}}) =>  {
  const { outletId } = params;
  const body = await request.json()

  const outletPaymentMethod = await prisma.outletPaymentMethod.create({
    data: {
      outletId: Number(outletId),
      storeId: 1,
      paymentMethodId: Number(body.PaymentMethodId),
      isActive: true
    }
  })

  return NextResponse.json(outletPaymentMethod);
}
