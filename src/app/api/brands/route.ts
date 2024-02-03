import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../client";


export const GET = async (req: NextRequest) =>  {
  const search = req.nextUrl.searchParams.get('search');

  const brands = await prisma.brand.findMany({
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

  return NextResponse.json(brands);
}

export const POST = async (request: Request) =>  {
  const body = await request.json()

  const brand = await prisma.brand.create({
    data: {
      name: body.name,
      description: body.description,
      isActive: true,
      storeId: 1,
    }
  })

  return NextResponse.json(brand);
}
