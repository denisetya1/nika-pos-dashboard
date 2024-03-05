"use server"

import { prisma } from "@/lib/client";

export const getOutlets = async (storeId: number) => {
  const outlets = await prisma.outlet.findMany({
    where: {
      id: storeId
    }
  })
  
  return outlets
}

export const getOutletsByStoreIdAndIds = async ({
  storeId,
  ids
}: {
  storeId: string|undefined,
  ids: (string|undefined)[]
}) => {
  if(storeId && ids.length > 0) {
    const outlets = await prisma.outlet.findMany({
      where: {
        storeId: Number(storeId),
        id: {
          in: ids.map((id)=> Number(id))
        }
      }
    })
    return outlets
  }
  
  return []
}

export const getOutlet = async (outletId: number) => {
  const outlets = await prisma.outlet.findFirst({
    where: {
      id: outletId
    }
  })
  
  return outlets
}

export const getUserOutlets = async (userId: string) => {
  const userOutlet = await prisma.userOutlet.findMany({
    where: {
      userId,
      isActive: true
    },
    include: {
      outlet: true
    }
  })
  
  return userOutlet
}