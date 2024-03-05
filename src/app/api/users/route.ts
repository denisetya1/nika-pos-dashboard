import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { prisma } from "@/lib/client";

export const GET = async (req: NextRequest) =>  {
  const search = req.nextUrl.searchParams.get('search');

  const users = await prisma.user.findManyAndCount({
    where: {
      storeId: 1,
      ...(search !== "" && search !== undefined && search !== null ? {name: { contains: search }} : {})
    }
  });

  return NextResponse.json(users);
}

export const POST = async (request: Request) =>  {
  const body = await request.json()

  const user = await prisma.user.create({
    data: {
      name: body.name,
      username: body.username,
      password: await bcrypt.hash(body.password, 10),
      phone: body.phone,
      storeId: 1,
      isActive: true,
    }
  })

  return NextResponse.json(user);
}
