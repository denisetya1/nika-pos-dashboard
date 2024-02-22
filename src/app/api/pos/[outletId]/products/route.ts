import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";
import { isEmptyVal } from "@/app/helpers/functions";
import { verifyJwt } from "@/app/lib/jwt";

export const GET = async (req: NextRequest, {params} : { params: {
  outletId: string
}}) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const { outletId } = params;
    const categoryId = req.nextUrl.searchParams.get('categoryId');
    const brandId = req.nextUrl.searchParams.get('brandId');
    const search = req.nextUrl.searchParams.get('search');

    // const sort: string = req.nextUrl.searchParams.get('sort') || ''
    // const direction = req.nextUrl.searchParams.get('direction') || "asc"

    let limit = Number(req.nextUrl.searchParams.get('limit'))
    let page = Number(req.nextUrl.searchParams.get('page'))

    if(isEmptyVal(limit, true)){
      limit = 20
    }

    if(isEmptyVal(page, true)){
      page = 1
    }

    const productsStocks = await prisma.productStock.findManyAndCount({
      where: {
        AND : [
          {storeId: 1},
          {outletId: Number(outletId)},
          {...(brandId !== "" && brandId !== undefined && brandId !== null ? {product: { brandId: Number(brandId)}} : {})},
          {...(categoryId !== "" && categoryId !== undefined && categoryId !== null ? {product: { categoryId: Number(categoryId) }} : {})},
          {...(search !== null ? { OR: [
              {product: {
                  name: {
                    contains: search
                  }
                }
              },
              {product: { sku: search }
              },
              {product: { barcode: search }
              }
            ] } : {})
          },
          {outletId: Number(outletId)}
        ]
      },
      orderBy: {
        product: {
          name: "asc"
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        quantity: true,
        sellPrice: true,
        sellPriceGrosir: true,
        minGrosir: true,
        markupPercentage: true,
        discountPercentage: true,
        product: {
          select: {
            id: true,
            name: true,
            barcode: true,
            sku: true,
            categoryId: true,
            brandId: true,
            linkShopee: true,
            isActive: true,
            createdAt:true,
            brand: {
              select: {
                id: true,
                name: true,
              }
            },
            category: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      },
    })

    productsStocks.push(page)
    productsStocks.push(limit)

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: productsStocks
    });
  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "Unathorized Error!"
    }, {
      status: 401
    });
  }
}