import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../client";

export const PUT = async (request: NextRequest, {params}: {params: {
  outletId: string,
  shiftId: string,
}}) =>  {
  const { shiftId } = params;
  const body = await request.json()

  const shift = await prisma.shift.update({
    where: {
      id: Number(shiftId)
    },
    data: {
      name: body.name,
      workingHours: body.workingHours,
      isActive: body.isActive
    }
  })

  return NextResponse.json(shift);
}

export const PATCH = async (request: NextRequest, {params}: {params: {
  outletId: string,
  shiftId: string,
}}) =>  {
  const { shiftId } = params;
  const body = await request.json()

  const shift = await prisma.shift.update({
    where: {
      id: Number(shiftId)
    },
    data: {
      isActive: body.isActive
    }
  })

  return NextResponse.json(shift);
}

export const DELETE = async (request: NextRequest, {params}: {params: {
  outletId: string,
  shiftId: string,
}}) =>  {
  const { shiftId } = params;

  const shift = await prisma.shift.delete({
    where: {
      id: Number(shiftId)
    }
  })

  return NextResponse.json(shift);
}