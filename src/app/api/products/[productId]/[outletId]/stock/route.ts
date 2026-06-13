import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import moment from "moment";
import { dateUTC } from "@/lib/functions";

export const POST = async (
  request: Request,
  {
    params,
  }: {
    params: {
      productId: string;
      outletId: string;
    };
  },
) => {
  const { productId, outletId } = params;
  const body = await request.json();
  const {
    quantity,
    moveTypeId,
    direction,
    description,
    moveDateStr,
    expiredDateStr,
    cogs,
  } = body;

  const stock = await prisma.productStock.findFirst({
    where: {
      storeId: 1,
      productId: Number(productId),
      outletId: Number(outletId),
    },
  });

  let startQuantity = 0;
  let endQuantity = Number(quantity);

  if (stock !== null) {
    startQuantity = stock.quantity;

    if (body.direction === "IN") endQuantity = startQuantity + Number(quantity);
    else endQuantity = startQuantity - Number(quantity);
  }

  const updateStock = await prisma.productStock.upsert({
    where: {
      storeId_productId_outletId: {
        storeId: 1,
        productId: Number(productId),
        outletId: Number(outletId),
      },
    },
    update: {
      quantity: {
        increment:
          body.direction === "IN" ? Number(quantity) : -1 * Number(quantity),
      },
      cogs: Number(cogs),
      stockMovements: {
        create: {
          moveDate: dateUTC(moveDateStr),
          moveDateStr: moveDateStr,
          expiredDate: expiredDateStr ? dateUTC(expiredDateStr) : null,
          expiredDateStr: expiredDateStr ? expiredDateStr : null,
          moveTypeId: Number(moveTypeId),
          direction: direction,
          startQuantity,
          quantity: Number(quantity),
          cogs: Number(cogs),
          endQuantity,
          description: description,
        },
      },
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
      cogs: Number(cogs),
      stockMovements: {
        create: {
          moveDate: dateUTC(moveDateStr),
          moveDateStr: moveDateStr,
          expiredDate: expiredDateStr ? dateUTC(expiredDateStr) : null,
          expiredDateStr: expiredDateStr ? expiredDateStr : null,
          moveTypeId: Number(moveTypeId),
          direction: direction,
          startQuantity,
          quantity: Number(quantity),
          cogs: Number(cogs),
          endQuantity,
          description: description,
        },
      },
    },
  });

  return NextResponse.json(updateStock);
};
