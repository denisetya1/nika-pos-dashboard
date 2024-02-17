import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../client";

export const GET = async (req: NextRequest) => {
  const paymentMethods = await prisma.paymentMethod.findMany({
    where:{
      isActive: true
    },
    include:{
      OutletPaymentMethods: true
    }
  })

  return NextResponse.json(paymentMethods)
}
