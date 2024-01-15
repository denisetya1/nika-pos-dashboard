import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../client";


export const GET = async (req: NextRequest) =>  {
  const search = req.nextUrl.searchParams.get('search');

  const categories = await prisma.category.findMany({
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

  return NextResponse.json(categories);
}

export const POST = async (request: Request) =>  {
  const body = await request.json()

  const cat = await prisma.category.create({
    data: {
      name: body.name,
      description: body.description,
      isActive: true,
      storeId: 1,
    }
  })


  return NextResponse.json(cat);
}
