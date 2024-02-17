import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { prisma } from "../../../client";

export const GET = async (req: NextRequest, {params}: {params: {
  outletId: string,
}}) =>  {
  
  const { outletId } = params;
  const userOutlet = await prisma.userOutlet.findMany({
    where:{
      outletId: Number(outletId),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          isActive: true,
        }
      }
    }
  })

  return NextResponse.json(userOutlet)
}

export const POST = async (request: Request, {params}: {params: {
  outletId: string
}}) =>  {
  const { outletId } = params;
  const body = await request.json()

  const userOutlet = await prisma.userOutlet.create({
    data: {
      outletId: Number(outletId),
      userId: body.userId,
      roleId: body.roleId,
      isActive: true
    }
  })

  return NextResponse.json(userOutlet);
}
