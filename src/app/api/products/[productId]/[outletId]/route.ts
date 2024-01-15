import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../client";
import { ProductStock } from "@prisma/client";


export const GET = async (req: NextRequest, 
  { params }: { 
    params: { 
      productId: string
      outletId: string
    } 
  }
) =>  {
  const {productId, outletId } = params
  const categoryId = req.nextUrl.searchParams.get('categoryId');
  const brandId = req.nextUrl.searchParams.get('brandId');
  const search = req.nextUrl.searchParams.get('search');

  const products = await prisma.product.findMany({
    where: {
      AND : [
        {storeId: 1},
        {...(brandId !== "" && brandId !== undefined && brandId !== null ? {brandId: Number(brandId)} : {})},
        {...(categoryId !== "" && categoryId !== undefined && categoryId !== null ? {categoryId: Number(categoryId)} : {})},
        {...(search !== null ? { OR: [
            {name: {
              contains: search
            }},
            {sku: search},
            {barcode: search}
          ] } : {})
        }
      ]
    },
    include: {
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
      },
      stocks: {
        where: {
          outletId: Number(outletId)
        },
        select: {
          id: true,
          quantity: true,
          sellPrice: true,
          sellPriceGrosir: true,
          minGrosir: true,
        }
      }
    }
  });

  return NextResponse.json(products);
}

export const POST = async (request: Request) =>  {
  const body = await request.json()

  let productStockId = body.productStockId
  let productStock: ProductStock

  if(productStockId === "0" || productStockId === "" || productStockId === undefined){
      productStock = await prisma.productStock.create({
      data:{
          storeId: 1,
          productId: Number(body.productId),
          outletId: Number(body.outletId),
          quantity: Number(body.quantity),
          minGrosir: 0,
          sellPrice: 0,
          sellPriceGrosir: 0,
          isActive: true,
          stockMovements: {
            create: {
              moveDate: new Date(),
              moveTypeId: Number(body.moveTypeId),
              direction: body.direction,
              quantity: Number(body.quantity),
              description: body.description
            }
          }
      }
    })

    productStockId = productStock.id
    
  } else {
      productStock = await prisma.productStock.update({
      where: {
        id: Number(productStockId)
      },
      data:{
        quantity: {
          increment: body.direction === 'IN' ? Number(body.quantity) : -1 * Number(body.quantity),
        },
        stockMovements: {
          create: {
            moveDate: new Date(),
            moveTypeId: Number(body.moveTypeId),
            direction: body.direction,
            quantity: Number(body.quantity),
            description: body.description
          }
        }
      }
    })
  }

  return NextResponse.json(productStock);
}
