import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import moment from "moment";
import { dateUTC } from "@/lib/functions";
import { getSessionData } from "@/actions/Sessions";

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
  const session = await getSessionData();
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

  console.log("outletId", outletId);

  let _cogs = cogs || 0;

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

    if (body.direction === "IN") {
      endQuantity = startQuantity + Number(quantity);
    } else {
      _cogs = 0;
      endQuantity = startQuantity - Number(quantity);
    }
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
      cogs: Number(_cogs),
      updatedBy: session?.user.username,
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
          cogs: Number(_cogs),
          endQuantity,
          description: description,
          updatedBy: session?.user.username,
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
      cogs: Number(_cogs),
      updatedBy: session?.user.username,
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
          cogs: Number(_cogs),
          endQuantity,
          description: description,
          updatedBy: session?.user.username,
        },
      },
    },
  });

  return NextResponse.json(updateStock);
};
