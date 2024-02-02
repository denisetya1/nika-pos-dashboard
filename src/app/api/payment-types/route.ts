import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../client";

export const GET = async (req: NextRequest) => {
  const paymentTypes = await prisma.paymentType.findMany({
    where:{
      isActive: true
    },
    include:{
      OutletPaymentTypes: true
    }
  })

  return NextResponse.json(paymentTypes)
}
