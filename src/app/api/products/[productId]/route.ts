import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export const PUT = async (req: Request, { params }: { params: { productId: string } }) =>  {
  const body = await req.json()
  const { productId } = params

  const product = await prisma.product.update({
    where:{
      id: Number(productId)
    },
    data: {
      ...body
    }
  })
  
  return NextResponse.json(product);
}

export const DELETE = async (req: Request, { params }: { params: { productId: string } }) =>  {
  const { productId } = params

  const product = await prisma.product.delete({
    where: {
      id: Number(productId)
    }
  });

  return NextResponse.json(product);
}
