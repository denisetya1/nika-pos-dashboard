import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export const PUT = async (req: Request, { params }: { params: { id: string } }) =>  {
  const body = await req.json()
  const { id } = params
  const { name } = body

  const cat = await prisma.brand.update({
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

  const brand = await prisma.brand.delete({
    where: {
      id: Number(id)
    }
  });

  return NextResponse.json(brand);
}
