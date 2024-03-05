import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export const PUT = async (request: NextRequest, {params}: {params: {
  outletId: string,
}}) =>  {
  const body = await request.json()
  const { outletId } = params

  const outlet = await prisma.outlet.update({
    where:{
      id: Number(outletId)
    },
    data: {
      name: body.name,
      phone: body.phone,
      address: body.address,
      printExtraInfo: body.printExtraInfo,
      printHeaderLine1: body.printHeaderLine1,
      printHeaderLine2: body.printHeaderLine2,
      printHeaderLine3: body.printHeaderLine3,
      printHeaderLine4: body.printHeaderLine4,
      printHeaderLine5: body.printHeaderLine5,
    }
  })


  return NextResponse.json(outlet);
}
