import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";
import { verifyJwt } from "@/app/lib/jwt";
import { connect } from "http2";

export const POST = async (req: NextRequest) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const body = await req.json()

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
      const ps = await prisma.productStock.update({
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

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: transaction
    });

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