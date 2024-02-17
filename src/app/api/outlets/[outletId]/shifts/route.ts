import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";

export const GET = async (req: NextRequest, {params}: {params: {
  outletId: string,
}}) =>  {
  
  const { outletId } = params;
  const paymentMethods = await prisma.shift.findMany({
    where:{
      outletId: Number(outletId)
    }
  })

  return NextResponse.json(paymentMethods)
}

export const POST = async (request: Request, {params}: {params: {
  outletId: string
}}) =>  {
  const { outletId } = params;
  const body = await request.json()

  const shiftOutletCount = await prisma.shift.count({
    where: {
      outletId: Number(outletId)
    }
  })

  const shift = await prisma.shift.create({
    data: {
      outletId: Number(outletId),
      name: body.name,
      workingHours: body.workingHours,
      isActive: true,
      sort: shiftOutletCount + 1
    }
  })

  return NextResponse.json(shift);
}
