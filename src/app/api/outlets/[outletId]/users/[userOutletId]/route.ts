import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export const PATCH = async (request: NextRequest, {params}: {params: {
  outletId: string,
  userOutletId: string,
}}) =>  {
  const { userOutletId } = params;
  const body = await request.json()

  const userOutlet = await prisma.userOutlet.update({
    where: {
      id: Number(userOutletId)
    },
    data: {
      isActive: body.isActive
    }
  })

  return NextResponse.json(userOutlet);
}

export const DELETE = async (request: NextRequest, {params}: {params: {
  outletId: string,
  userOutletId: string,
}}) =>  {
  const { userOutletId } = params;

  const userOutlet = await prisma.userOutlet.delete({
    where: {
      id: Number(userOutletId)
    }
  })

  return NextResponse.json(userOutlet);
}