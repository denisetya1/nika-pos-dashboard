import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../client";

export const GET = async (req: NextRequest) =>  {
  const search = req.nextUrl.searchParams.get('search');

  const outlets = await prisma.outlet.findMany({
    where: {
      storeId: 1,
      ...(search !== "" && search !== undefined && search !== null ? {name: { contains: search }} : {})
    }
  });

  return NextResponse.json(outlets);
}

export const POST = async (request: Request) =>  {
  const body = await request.json()

  const outlet = await prisma.outlet.create({
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
      isActive: true,
      storeId: 1,
    }
  })


  return NextResponse.json(outlet);
}
