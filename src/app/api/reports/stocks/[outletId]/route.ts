import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";


export const GET = async (req: NextRequest, { params }: { params: { outletId: string } }) =>  {

  const { outletId }  = params
  const categoryId = req.nextUrl.searchParams.get('categoryId');
  const brandId = req.nextUrl.searchParams.get('brandId');
  const search = req.nextUrl.searchParams.get('search');
  const date = req.nextUrl.searchParams.get('date');

  if(brandId === '' || brandId === null || brandId === undefined){
    return NextResponse.json([]);
  }

  const stockMoves = await prisma.stockMovement.findMany({
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
    orderBy: {
      productStock: {
        product: {
          name: 'asc'
        }
      }
    }
  });

  return NextResponse.json(stockMoves);
}
