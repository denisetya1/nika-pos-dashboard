import { prisma } from "../app/api/client";

export const getStore = async (storeId: number) => {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId
    }
  })
  
  return store
}