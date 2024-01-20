import { NextResponse } from "next/server";
import { prisma } from "../../../../client";

export const POST = async (request: Request, { params }: { 
  params: { 
    productId: string
    outletId: string
  } 
}) =>  {
  const {productId, outletId } = params
  const body = await request.json()
  const { quantity, moveTypeId, direction, description} = body

  const updateStock = await prisma.productStock.upsert({
    where: {
      storeId_productId_outletId: {
        storeId: 1,
        productId: Number(productId),
        outletId: Number(outletId)
      }
    },
    update: {
      quantity: {
        increment: body.direction === 'IN' ? Number(quantity) : -1 * Number(quantity),
      },
      stockMovements: {
        create: {
          moveDate: new Date(),
          moveTypeId: Number(moveTypeId),
          direction: direction,
          quantity: Number(quantity),
          description: description
        }
      }
    },
    create: {
      storeId: 1,
      productId: Number(productId),
      outletId: Number(outletId),
      quantity: Number(quantity),
      minGrosir: 0,
      sellPrice: 0,
      sellPriceGrosir: 0,
      markupPercentage: 0,
      discountPercentage: 0,
      isActive: true,
      stockMovements: {
        create: {
          moveDate: new Date(),
          moveTypeId: Number(moveTypeId),
          direction: direction,
          quantity: Number(quantity),
          description: description,
        }
      }
    }
  })

  return NextResponse.json(updateStock);
}
