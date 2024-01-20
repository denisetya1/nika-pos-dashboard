import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../client";
import { ProductStock } from "@prisma/client";
import { isEmptyVal, sortByKey } from "@/app/helpers/functions";


export const GET = async (req: NextRequest) =>  {
  const outletId = req.nextUrl.searchParams.get('outletId');
  const categoryId = req.nextUrl.searchParams.get('categoryId');
  const brandId = req.nextUrl.searchParams.get('brandId');
  const search = req.nextUrl.searchParams.get('search');

  const sort = req.nextUrl.searchParams.get('sort')
  const direction = req.nextUrl.searchParams.get('direction') || "asc"

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
      ...(sort === 'name' ? {name: direction} : {}),
      ...(sort === 'sku' ? {sku: direction} : {}),
      ...(sort === 'barcode' ? {barcode: direction} : {}),
      ...(sort === 'category' ? { category: {name: direction}} : {}),
      ...(sort === 'brand' ? { brand: {name: direction}} : {}),
      // ...(sort === 'sellprice' ? { stocks: {sellPrice: direction, nulls: 'first'}} : {}),
      // ...(sort === 'stock' ? { stocks: {quantity: direction}} : {})
    }
  }

  let ids: bigint[] = []
  let count = 0
  let isSortedByPriceQuantity = false

  if(!isEmptyVal(sort) && (sort === 'sellprice' || sort === 'quantity')){
    const productsStocks = await prisma.productStock.findManyAndCount({
      where: {
        AND : [
          {storeId: 1},
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
        ...(sort === 'sellprice' ? {sellPrice: direction === "asc" ? "asc" : "desc"} : {}),
        ...(sort === 'quantity' ? {quantity: direction === "asc" ? "asc" : "desc"} : {}),
      },
      select: {
        productId: true
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const [list, listCount] = productsStocks
    ids = list.map((item)=> item.productId)
    count = listCount
    isSortedByPriceQuantity = true
  }
  
  const products = await prisma.product.findManyAndCount({
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
        },
        {...(ids.length > 0 ? {
          id: {
            in: ids
          }
        } : {} )}
      ]
    },
    orderBy,
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
          markupPercentage: true,
          discountPercentage: true
        }
      }
    },
    ...(!isSortedByPriceQuantity ? {skip: (page - 1) * limit} : {}),
    ...(!isSortedByPriceQuantity ? {take: limit} : {} ),
  });

  if(sort === 'sellprice'){
    products[1] = count

    if(direction === 'asc')
      products[0].sort(function(a, b){return Number(a.stocks[0].sellPrice) - Number(b.stocks[0].sellPrice)});
    else
      products[0].sort(function(a, b){return Number(b.stocks[0].sellPrice) - Number(a.stocks[0].sellPrice)});
  }
  if(sort === 'quantity'){
    products[1] = count

    if(direction === 'asc')
      products[0].sort(function(a, b){return a.stocks[0].quantity - b.stocks[0].quantity});
    else
      products[0].sort(function(a, b){return b.stocks[0].quantity - a.stocks[0].quantity});
  }

  products.push(page)
  products.push(limit)

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
          markupPercentage: 0,
          discountPercentage: 0,
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
