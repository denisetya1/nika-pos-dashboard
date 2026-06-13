"use server"

import { prisma } from "@/lib/client"
import moment from "moment";

export const getExpiredProducts = async () => {
  const expiredProducts = await prisma.stockMovement.findMany({
    where: {
      expiredDate: {
        not: null,
        lte: new Date(moment().add("3", "months").toString()),
        gte: new Date(moment().toString()),
      },
      soldOut: null
    },
    select: {
      id: true,
      productStockId: true,
      expiredDate: true,
      moveDate: true,
      quantity: true,
      productStock: {
        select: {
          id: true,
          productId: true,
          quantity: true,
          product: {
            select: {
              name: true,
              id: true
            }
          },
        }
      }
    }
  })

  return expiredProducts;
}

export const setSoldOut = async (moveStockId: string, value: boolean) => {

  const stockMovement = await prisma.stockMovement.update({
    where: {
      id: Number(moveStockId)
    },
    data: {
      soldOut: value
    }
  });

  return stockMovement;
}
