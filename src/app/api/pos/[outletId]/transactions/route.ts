import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";

const createTransaction = (data: any) => {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        id: data.id,
        outlet: {
          connect: {
            id: data.outletId
          }
        },
        storeId: data.storeId,
        user: {
          connect: {
            id: data.userId
          }
        },
        userShift: {
          connect: {
            id: data.userShiftId
          }
        },
        totalItem: data.totalItem,
        totalPrice: data.totalPrice,
        totalDiscount: 0,
        amountPaid: data.amountPaid,
        amountChange: data.amountChange,
        outletPaymentMethod:{
          connect: {
            id: data.outletPaymentMethodId
          }
        },
        cardNumber: data.cardNumber,
        confirmNumber: data.confirmNumber,
        transactionTime: data.transactionTime,
        transactionDetails: {
          createMany: {
            data: data.transactionDetails
          }
        }
      }, 
      include:{
        transactionDetails: true
      }
    })

    transaction.transactionDetails.map(async (product) => {
      const ps = await tx.productStock.update({
        where: {
          id: product.productStockId
        },
        data: {
          quantity: {
            increment: -1*product.qty
          }
        }
      })
    })

    return transaction
  })
}

export const POST = async (req: NextRequest) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const body = await req.json()

    const testProduct = body.transactionDetails.filter((p: any)=> p.name.toLowerCase().includes('test product'))
    
    if(testProduct.length > 0) {
      await prisma.testTransaction.create({
        data: {
          transactionId: body.id,
          data: JSON.stringify(body)
        }
      })
      return NextResponse.json({
        code: "SUCCESS",
        message: "",
        data: body
      });
    }

    const checkTransaction = await prisma.transaction.findUnique({
      where: {
        id: body.id
      }
    })

    if(checkTransaction){
      return NextResponse.json({
        code: "DATA_IS_EXISTS",
        message: "Nomor transaksi sudah ada!",
        data: body
      }, {
        status: 400
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        id: body.id,
        outlet: {
          connect: {
            id: body.outletId
          }
        },
        storeId: body.storeId,
        user: {
          connect: {
            id: body.userId
          }
        },
        userShift: {
          connect: {
            id: body.userShiftId
          }
        },
        totalItem: body.totalItem,
        totalPrice: body.totalPrice,
        totalDiscount: 0,
        amountPaid: body.amountPaid,
        amountChange: body.amountChange,
        outletPaymentMethod:{
          connect: {
            id: body.outletPaymentMethodId
          }
        },
        cardNumber: body.cardNumber,
        confirmNumber: body.confirmNumber,
        transactionTime: body.transactionTime,
        transactionDetails: {
          createMany: {
            data: body.transactionDetails
          }
        }
      }, 
      include:{
        transactionDetails: true
      }
    })

    transaction.transactionDetails.map(async (product) => {
      await prisma.productStock.update({
        where: {
          id: product.productStockId
        },
        data: {
          quantity: {
            increment: -1 * product.qty
          }
        }
      })
    })

    // const transaction = await createTransaction(body)

    if(transaction){
      return NextResponse.json({
        code: "SUCCESS",
        message: "",
        data: transaction
      });
    } else {
      return NextResponse.json({
        code: "ERROR",
        message: "Gagal menyimpan data!",
        data: null
      }, {
        status: 400
      });
    }

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "Unathorized Error!",
      data: null
    }, {
      status: 401
    });
  }
}