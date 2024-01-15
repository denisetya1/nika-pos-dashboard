import { NextResponse } from "next/server";
import { prisma } from "../../client";

export const PUT = async (req: Request, { params }: { params: { id: string } }) =>  {
  const body = await req.json()
  const { id } = params
  const { name, direction } = body

  const moveType = await prisma.moveType.update({
    where:{
      id: Number(id)
    },
    data: {
      name,
      direction
    }
  })
  
  return NextResponse.json(moveType);
}

export const DELETE = async (req: Request, { params }: { params: { id: string } }) =>  {
  const { id } = params

  const moveType = await prisma.moveType.delete({
    where: {
      id: Number(id)
    }
  });

  return NextResponse.json(moveType);
}
