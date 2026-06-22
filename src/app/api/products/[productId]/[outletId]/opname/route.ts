import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import moment from "moment";
import { history } from "@/types/common";
import { getSessionData } from "@/actions/Sessions";

export const GET = async (
  request: NextRequest,
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
  const { productId } = params;

  const outletId = session?.user.outletId;

  const stock = await prisma.productStock.findFirst({
    where: {
      storeId: 1,
      productId: Number(productId),
      outletId: Number(outletId),
    },
  });

  const startDate =
    request?.nextUrl?.searchParams.get("startDate") ||
    moment().subtract(30, "days").format("YYYY-MM-DD");
  const endDate =
    request?.nextUrl?.searchParams.get("endDate") ||
    moment().format("YYYY-MM-DD");
  const history: history[] = [];

  if (stock !== null) {
    const stockOpnames = await prisma.transactionDetail.findMany({
      where: {
        productId: Number(productId),
        transaction: {
          outletId: Number(outletId),
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      },
      select: {
        transaction: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
            confirmNumber: true,
            cardNumber: true,
            outletPaymentMethod: {
              select: {
                paymentMethodId: true,
                paymentMethod: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        productId: true,
        productStockId: true,
        name: true,
        qty: true,
        finalSellPrice: true,
        createdAt: true,
      },
    });

    if (stockOpnames) {
      stockOpnames.map((so) => {
        let sales = `${so.transaction.id}`;
        let desc = null;

        if (so.transaction.outletPaymentMethod.paymentMethodId === 4) {
          sales = `${so.transaction.cardNumber}${so.transaction.confirmNumber}`;
          desc = so.transaction.id;
        }

        history.push({
          transactionId: sales,
          productId: so.productId,
          name: so.name,
          qty: so.qty,
          price: so.finalSellPrice,
          date: so.createdAt,
          direction: "OUT",
          description: desc,
        });
      });
    }

    console.log(
      "asdsa",
      productId,
      outletId,
      startDate,
      moment(endDate).add(1, "d").format("YYYY-MM-DD"),
    );

    let moveStock = await prisma.stockMovement.findMany({
      where: {
        productStock: {
          productId: Number(productId),
          outletId: Number(outletId),
        },
        createdAt: {
          gte: new Date(startDate),
          lt: new Date(moment(endDate).add(1, "d").format("YYYY-MM-DD")),
        },
      },
      select: {
        productStock: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        quantity: true,
        direction: true,
        createdAt: true,
        description: true,
        moveType: {
          select: {
            name: true,
          },
        },
      },
    });

    if (moveStock) {
      moveStock.map((move) => {
        history.push({
          transactionId: move.moveType.name,
          productId: move.productStock.product.id,
          name: move.productStock.product.name,
          qty: move.quantity,
          price: null,
          date: move.createdAt,
          direction: move.direction,
          description: move.description,
        });
      });
    }
  }

  if (history.length > 0) {
    history.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  return NextResponse.json(history);
};
