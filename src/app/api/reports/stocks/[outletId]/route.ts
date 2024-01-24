import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";
import { isEmptyVal } from "@/app/helpers/functions";


export const GET = async (req: NextRequest, { params }: { params: { outletId: string } }) =>  {

  const { outletId }  = params
  const categoryId = req.nextUrl.searchParams.get('categoryId');
  const brandId = req.nextUrl.searchParams.get('brandId');
  const search = req.nextUrl.searchParams.get('search');
  const moveDate = new Date(req.nextUrl.searchParams.get('moveDate') || '')

  const sort = req.nextUrl.searchParams.get('sort')
  const direction = req.nextUrl.searchParams.get('direction')

  let limit = Number(req.nextUrl.searchParams.get('limit'))
  let page = Number(req.nextUrl.searchParams.get('page'))

  if(isEmptyVal(limit, true)){
    limit = 50
  }

  if(isEmptyVal(page, true)){
    page = 1
  }


  let orderBy = {}

  if(!isEmptyVal(sort)){
    orderBy = {
      ...(sort === 'name' ? {productStock: { product: {name: direction} } } : {}),
      ...(sort === 'sku' ?  {productStock: { product: {sku: direction} } } : {}),
      ...(sort === 'barcode' ?  {productStock: { product: {barcode: direction} } } : {}),
      ...(sort === 'category' ?  {productStock: { product: {category:{name: direction}} } } : {}),
      ...(sort === 'brand' ? {productStock: { product: {brand:{name: direction}} } } : {}),
    }
  } else {
    orderBy = {productStock: { product: {name: 'asc'} } }
  }

  const stockMoves = await prisma.stockMovement.findManyAndCount({
    where: {
      productStock: {
        outletId: Number(outletId),
        product: {
          storeId: 1,
          ...(brandId !== "" && brandId !== undefined && brandId !== null ? {brandId: Number(brandId)} : {}),
          ...(categoryId !== "" && categoryId !== undefined && categoryId !== null ? {categoryId: Number(categoryId)} : {}),
          ...(search !== null ? { name: { contains: search }} : {})
        }
      }
    },
    include: {
      productStock: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
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
      },
      moveType: {
        select: {
          id: true,
          name: true,
          direction: true
        }
      }
    },
    orderBy
  });

  stockMoves.push(page)
  stockMoves.push(limit)

  return NextResponse.json(stockMoves);
}
