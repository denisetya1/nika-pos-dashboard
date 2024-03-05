import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";


export const GET = async (req: NextRequest) =>  {
  const search = req.nextUrl.searchParams.get('search');

    const movements = await prisma.moveType.findMany({
      where: {
        AND: [
          {...(search !== "" && search !== undefined && search !== null ? {name: { contains: search }} : {})},
          {OR: [
            {storeId: null},
            {storeId: 1}
          ]}
        ]
      }
    });
    return NextResponse.json(movements);
}

export const POST = async (request: Request) =>  {
  const body = await request.json()

  const moveType = await prisma.moveType.create({
    data: {
      name: body.name,
      direction: body.direction,
      isActive: true,
      storeId: 1,
    }
  })

  return NextResponse.json(moveType);
}
