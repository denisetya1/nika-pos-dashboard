import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export const PATCH = async (request: NextRequest, {params}: {params: {
  outletId: string,
}}) =>  {
  const { outletId } = params;
  const body = await request.json()

  const outlet = await prisma.outlet.update({
    where: {
      id: Number(outletId),
    },
    data: {
      isActivePOS: body.isActivePOS,
    }
  })

  return NextResponse.json(outlet);
}