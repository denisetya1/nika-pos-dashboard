import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";
import { isEmptyVal } from "@/app/helpers/functions";

export const GET = async (req: NextRequest, {params}: {params: {
  outletId: string
}}) => {

  const { outletId } = params
  const categoryId = req.nextUrl.searchParams.get('categoryId')
  const brandId = req.nextUrl.searchParams.get('brandId')
  const search = req.nextUrl.searchParams.get('search')

  const productPrices = await prisma.productStock.findMany({
    where: {
      outletId: Number(outletId),
      storeId: 1,
      product: {
        AND: [
          {...(!isEmptyVal(brandId) ? {brandId: Number(brandId)} : {})},
          {...(!isEmptyVal(categoryId) ? {categoryId: Number(categoryId)} : {})},
          {...(!isEmptyVal(search) ? { OR: [
              {name: {
                contains: search || ""
              }},
              {sku: search},
              {barcode: search}
            ] } : {})
          },
        ]
      }
    },
    orderBy: {
      product: {
        name: 'asc'
      }
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          barcode: true,
          priceTagLabel: true,
          brand: {
            select: {
              id: true,
              name: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  }) 

  return NextResponse.json(productPrices);

}