import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { dateUTC } from "@/lib/functions";
import moment from "moment";

export const POST = async (request: Request, { params }: {
  params: {
    productId: string
    outletId: string
  }
}) => {
  const { productId, outletId } = params
  const body = await request.json()
  const { quantity, description, outletDestinationId, withPrice } = body

  const stock = await prisma.productStock.findFirst({
    where: {
      storeId: 1,
      productId: Number(productId),
      outletId: Number(outletId)
    }
  })

  let startQuantity = 0
  let endQuantity = Number(quantity)

  if (stock !== null) {
    startQuantity = stock.quantity

    if (body.direction === 'IN')
      endQuantity = startQuantity + Number(quantity)
    else
      endQuantity = startQuantity - Number(quantity)
  }

  let desc = description

  if (withPrice === "1") {
    desc = `${description}\r\n Samakan Harga: ${withPrice === '1' ? 'YA' : 'TIDAK'}`
  }

  const moveDateStr = moment().format('YYYY-MM-DD')

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
        increment: -1 * Number(quantity),
      },
      stockMovements: {
        create: {
          moveDate: dateUTC(moveDateStr),
          moveDateStr: moveDateStr,
          moveTypeId: 11,
          direction: 'OUT',
          startQuantity,
          quantity: Number(quantity),
          endQuantity,
          description: desc
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
          moveDate: dateUTC(moveDateStr),
          moveDateStr: moveDateStr,
          moveTypeId: 11,
          direction: 'OUT',
          startQuantity,
          quantity: Number(quantity),
          endQuantity,
          description: desc,
        }
      }
    }
  })

  //update destination
  if (updateStock) {
    const stockDestination = await prisma.productStock.findFirst({
      where: {
        storeId: 1,
        productId: Number(productId),
        outletId: Number(outletDestinationId)
      }
    })

    let startQuantityDest = 0
    let endQuantityDest = Number(quantity)

    if (stockDestination !== null) {
      startQuantityDest = stockDestination.quantity

      endQuantityDest = startQuantityDest + Number(quantity)
    }

    const updateDestinationStock = await prisma.productStock.upsert({
      where: {
        storeId_productId_outletId: {
          storeId: 1,
          productId: Number(productId),
          outletId: Number(outletDestinationId)
        }
      },
      update: {
        quantity: {
          increment: Number(quantity),
        },
        stockMovements: {
          create: {
            moveDate: dateUTC(moveDateStr),
            moveDateStr: moveDateStr,
            moveTypeId: 1,
            direction: 'IN',
            startQuantity: startQuantityDest,
            quantity: Number(quantity),
            endQuantity: endQuantityDest,
            description: desc
          }
        }
      },
      create: {
        storeId: 1,
        productId: Number(productId),
        outletId: Number(outletDestinationId),
        quantity: Number(quantity),
        minGrosir: 0,
        sellPrice: 0,
        sellPriceGrosir: 0,
        markupPercentage: 0,
        discountPercentage: 0,
        isActive: true,
        stockMovements: {
          create: {
            moveDate: dateUTC(moveDateStr),
            moveDateStr: moveDateStr,
            moveTypeId: 1,
            direction: 'IN',
            startQuantity: startQuantityDest,
            quantity: Number(quantity),
            endQuantity: endQuantityDest,
            description: desc,
          }
        }
      }
    })

    if (updateDestinationStock && withPrice === '1') {
      const source = await prisma.productStock.findUnique({
        where: {
          id: updateStock.id
        }
      })

      if (source) {
        await prisma.productStock.update({
          where: {
            id: updateDestinationStock.id
          },
          data: {
            sellPrice: source.sellPrice,
            sellPriceGrosir: source.sellPriceGrosir,
            markupPercentage: source.markupPercentage,
            discountPercentage: source.discountPercentage,
          }
        })
      }
    }
  }

  return NextResponse.json(updateStock);
}
