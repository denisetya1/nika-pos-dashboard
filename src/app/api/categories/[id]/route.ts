import { NextResponse } from "next/server";
import { prisma } from "../../client";

export const PUT = async (req: Request, { params }: { params: { id: string } }) =>  {
  const body = await req.json()
  const { id } = params
  const { name } = body

  const cat = await prisma.category.update({
    where:{
      id: Number(id)
    },
    data: {
      name
    }
  })
  
  return NextResponse.json(cat);
}

export const DELETE = async (req: Request, { params }: { params: { id: string } }) =>  {
  const { id } = params

  const category = await prisma.category.delete({
    where: {
      id: Number(id)
    }
  });

  return NextResponse.json(category);
}
