import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export const PATCH = async (request: NextRequest, {params}: {params: {
  userId: string,
}}) =>  {
  const { userId } = params;
  const body = await request.json()

  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      isActive: body.isActive
    }
  })

  return NextResponse.json(user);
}

export const PUT = async (request: NextRequest, {params}: {params: {
  userId: string,
}}) =>  {
  const { userId } = params;
  const body = await request.json()

  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name: body.name,
      username: body.username,
      phone: body.phone,
      isActive: true,
    }
  })

  return NextResponse.json(user);
}

export const DELETE = async (request: NextRequest, {params}: {params: {
  userId: string,
}}) =>  {
  const { userId } = params;

  await prisma.userOutlet.deleteMany({
    where: {
      userId
    }
  })

  const user = await prisma.user.delete({
    where: {
      id: userId
    }
  })

  return NextResponse.json(user);
}