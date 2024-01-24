import { NextResponse } from "next/server";
import { prisma } from "../../../../client";

export const PATCH = async (request: Request, {params}: {params: {
  outletId: string,
  outletPaymentId: string
}}) =>  {
  const { outletPaymentId } = params;
  const body = await request.json()

  const outletPaymentType = await prisma.outletPaymentType.update({
    where: {
      id: Number(outletPaymentId)
    },
    data: {
      isActive: body.isActive
    }
  })

  return NextResponse.json(outletPaymentType);
}