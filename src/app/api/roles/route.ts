import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../client";

export const GET = async (req: NextRequest) =>  {
  const search = req.nextUrl.searchParams.get('search');

  const roles = await prisma.role.findMany({
    where: {
      OR: [
        {storeId: 1},
        {storeId: null}
      ]
    }
  });

  return NextResponse.json(roles);
}

export const POST = async (request: Request) =>  {
  const body = await request.json()

  const role = await prisma.role.create({
    data: {
      name: body.name,
      storeId: 1,
      roles: {},
      isActive: true,
      updateBy: 'user'
    }
  })

  return NextResponse.json(role);
}
