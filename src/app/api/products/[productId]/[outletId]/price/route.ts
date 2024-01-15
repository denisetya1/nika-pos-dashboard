import { NextResponse } from "next/server";
import { prisma } from "../../../../client";

export const PATCH = async (request: Request, {params}: {params: {
  productId: string
  outletId: string
}}) =>  {
  const { productId, outletId } = params
  const body = await request.json()
  const { sellPrice, linkShopee } = body

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
          sellPrice
        },
        create: {
          storeId: 1,
          productId: Number(productId),
          outletId: Number(outletId),
          quantity: 0,
          minGrosir: 0,
          sellPrice,
          sellPriceGrosir: 0,
          isActive: true
        }
      })

  return NextResponse.json(updatePrice);
}
