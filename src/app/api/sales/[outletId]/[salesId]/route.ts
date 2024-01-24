import { NextResponse } from "next/server";
import { prisma } from "../../../client";

export const GET = async (request: Request, {params}: {params: {
  productId: string
  outletId: string
}}) => {
  const { productId, outletId } = params
  const body = await request.json()

  const productPrices = await prisma.productStock.findMany({
    where: {
      productId: Number(productId),
      outletId: Number(outletId),
      storeId: 1 ,
    }
  }) 

}
