import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";

const updateData = (data: any, oldData: any) => {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.update({
      where: {
        id: data.transactionId,
      },
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

    //decrease stocks
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

    //revert old data stocks
    oldData.transactionDetails.map(async (product: any) => {
      const ps = await tx.productStock.update({
        where: {
          id: product.productStockId
        },
        data: {
          quantity: {
            increment: product.qty
          }
        }
      })
    })

    return transaction
  })
}

export const PUT = async (req: NextRequest) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const body = await req.json()

    const requestEditTransaction = await prisma.requestEditTransaction.findFirst({
      where: {
        transactionId: body.id,
        code: body.code
      }
    })

    if(requestEditTransaction){
      const oldData = await prisma.transaction.findUnique({
        where: {
          id: body.transactionId,
        }, 
        include: {
          transactionDetails: true
        }
      })

      const transaction = await updateData(body, oldData)
  
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
        code: "DATA_NOT_EXISTS",
        message: "Nomor transaksi tidak ditemukan!",
        data: body
      }, {
        status: 404
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