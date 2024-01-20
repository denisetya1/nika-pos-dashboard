import { NextResponse } from "next/server";
import { prisma } from "../../../../client";

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

export const PATCH = async (request: Request, {params}: {params: {
  productId: string
  outletId: string
}}) =>  {
  const { productId, outletId } = params
  const body = await request.json()
  const { 
    sellPrice, 
    linkShopee, 
    discountPercentage, 
    markupPercentage 
  } = body

  const updateProduct = await prisma.product.update({
    where: {
      id: Number(productId),
    },
    data: {
      linkShopee
    }
  })

  const updatePrice = await prisma.productStock.upsert({
        where: {
          storeId_productId_outletId: {
            storeId: 1,
            productId: Number(productId),
            outletId: Number(outletId)
          }
        },
        update: {
          sellPrice: Number(sellPrice),
          discountPercentage: Number(discountPercentage),
          markupPercentage: Number(markupPercentage),
        },
        create: {
          storeId: 1,
          productId: Number(productId),
          outletId: Number(outletId),
          quantity: 0,
          minGrosir: 0,
          sellPrice,
          sellPriceGrosir: 0,
          discountPercentage: Number(discountPercentage),
          markupPercentage: Number(markupPercentage),
          isActive: true
        }
      })

  return NextResponse.json(updatePrice);
}
