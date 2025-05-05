"use server"

import { prisma } from "@/lib/client"
import moment from "moment";
import { getSessionData } from "./Sessions";

export const getTopMonthlyProducts = async () => {
  const session = await getSessionData();

  const topProducts = await prisma.transactionDetail.groupBy({
    by: ["productId"],
    _sum: {
      qty: true,
    },
    where: {
      transaction: {
        outletId: Number(session?.user.outletId)
      },
      createdAt: {
        gte: new Date(moment().subtract(30, 'days').toString()),
      }
    },
    orderBy: {
      _sum: {
        qty: "desc",
      },
    },
    take: 30
  })

  const topList = topProducts.map((product) => ({
    id: product.productId,
    qty: product._sum.qty,
  }))

  const productDetails = await prisma.product.findMany({
    where: {
      id: {
        in: topList.flatMap((product) => product.id)
      }
    }
  })

  const qtyMap = new Map(topList.map(obj => [obj.id, obj]));

  const merged = productDetails.map(objX => ({
    ...objX,
    ...(qtyMap.get(objX.id) || {}) // Use the object from yMap if it exists
  }));

  merged.sort((a, b) => Number(b?.qty) - Number(a?.qty))

  return merged
}

export const getTopCategory = async () => {
  const session = await getSessionData();

  const topProducts = await prisma.transactionDetail.groupBy({
    by: ["categoryId"],
    _sum: {
      qty: true,
    },
    where: {
      transaction: {
        outletId: Number(session?.user.outletId)
      },
      createdAt: {
        gte: new Date(moment().subtract(30, 'days').toString()),
      }
    },
    orderBy: {
      _sum: {
        qty: "desc",
      },
    },
    take: 5
  })

  const topList = topProducts.map((res) => ({
    id: res.categoryId,
    qty: res._sum.qty,
  }))

  const categoryDetails = await prisma.category.findMany({
    where: {
      id: {
        in: topList.flatMap((category) => category.id)
      }
    }
  })

  const qtyMap = new Map(topList.map(obj => [obj.id, obj]));

  const merged = categoryDetails.map(objX => ({
    ...objX,
    ...(qtyMap.get(objX.id) || {}) // Use the object from yMap if it exists
  }));

  merged.sort((a, b) => Number(b?.qty) - Number(a?.qty))

  console.log(merged);

  return merged
}

export const getRealtimeSummary = async () => {
  const sumD = await prisma.transaction.aggregate({
    _sum: {
      totalPrice: true,
      totalItem: true,
    },
    _count: true,
    _avg: {
      totalPrice: true
    },
    where: {
      createdAt: {
        gte: new Date(`${moment().format("yy-MM-DD")} 00:00:00`),
        lte: new Date(`${moment().add(1, 'day').format("yy-MM-DD")} 04:00:00`),
      },
      outletPaymentMethod: {
        paymentMethodId: {
          not: 4
        }
      }
    }
  })

  const sumDmin1 = await prisma.transaction.aggregate({
    _sum: {
      totalPrice: true,
      totalItem: true,
    },
    _count: true,
    _avg: {
      totalPrice: true
    },
    where: {
      createdAt: {
        gte: new Date(`${moment().subtract(1, 'day').format("yy-MM-DD")} 00:00:00`),
        lte: new Date(`${moment().format("yy-MM-DD")} 23:59:59`),
      },
      outletPaymentMethod: {
        paymentMethodId: {
          not: 4
        }
      }
    }
  })

  const sumDmin2 = await prisma.transaction.aggregate({
    _sum: {
      totalPrice: true,
      totalItem: true,
    },
    _count: true,
    _avg: {
      totalPrice: true
    },
    where: {
      createdAt: {
        gte: new Date(`${moment().subtract(2, 'days').format("yy-MM-DD")} 00:00:00`),
        lte: new Date(`${moment().subtract(2, 'days').format("yy-MM-DD")} 23:59:59`),
      },
      outletPaymentMethod: {
        paymentMethodId: {
          not: 4
        }
      }
    }
  })

  const sumDmin3 = await prisma.transaction.aggregate({
    _sum: {
      totalPrice: true
    },
    _count: true,
    _avg: {
      totalPrice: true,
      totalItem: true,
    },
    where: {
      createdAt: {
        gte: new Date(`${moment().subtract(3, 'days').format("yy-MM-DD")} 00:00:00`),
        lte: new Date(`${moment().subtract(3, 'days').format("yy-MM-DD")} 23:59:59`),
      },
      outletPaymentMethod: {
        paymentMethodId: {
          not: 4
        }
      }
    }
  })

  const sumDmin4 = await prisma.transaction.aggregate({
    _sum: {
      totalPrice: true,
      totalItem: true,
    },
    _count: true,
    _avg: {
      totalPrice: true
    },
    where: {
      createdAt: {
        gte: new Date(`${moment().subtract(4, 'days').format("yy-MM-DD")} 00:00:00`),
        lte: new Date(`${moment().subtract(4, 'days').format("yy-MM-DD")} 23:59:59`),
      },
      outletPaymentMethod: {
        paymentMethodId: {
          not: 4
        }
      }
    }
  })

  const sumDmin5 = await prisma.transaction.aggregate({
    _sum: {
      totalPrice: true,
      totalItem: true,
    },
    _count: true,
    _avg: {
      totalPrice: true
    },
    where: {
      createdAt: {
        gte: new Date(`${moment().subtract(5, 'days').format("yy-MM-DD")} 00:00:00`),
        lte: new Date(`${moment().subtract(5, 'days').format("yy-MM-DD")} 23:59:59`),
      },
      outletPaymentMethod: {
        paymentMethodId: {
          not: 4
        }
      }
    }
  })

  const sumDmin6 = await prisma.transaction.aggregate({
    _sum: {
      totalPrice: true,
      totalItem: true,
    },
    _count: true,
    _avg: {
      totalPrice: true
    },
    where: {
      createdAt: {
        gte: new Date(`${moment().subtract(6, 'days').format("yy-MM-DD")} 00:00:00`),
        lte: new Date(`${moment().subtract(6, 'days').format("yy-MM-DD")} 23:59:59`),
      },
      outletPaymentMethod: {
        paymentMethodId: {
          not: 4
        }
      }
    }
  })

  return [
    sumD,
    sumDmin1,
    sumDmin2,
    sumDmin3,
    sumDmin4,
    sumDmin5,
  ]
}
