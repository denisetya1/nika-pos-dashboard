import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../client";
import { isEmptyVal } from "@/app/helpers/functions";
import moment from "moment";


export const GET = async (req: NextRequest, { params }: { params: { outletId: string } }) =>  {
  const { outletId } = params;
  const categoryId = req.nextUrl.searchParams.get('categoryId');
  const brandId = req.nextUrl.searchParams.get('brandId');
  const search = req.nextUrl.searchParams.get('search');
  const moveDateStr = req.nextUrl.searchParams.get('moveDateStr') || moment().format('YYYY-MM-D');

  const sort: string = req.nextUrl.searchParams.get('sort') || ''
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
      ...(sort === 'name' ? {product: {name: direction}} : {}),
      // ...(sort === 'sku' ? {sku: direction} : {}),
      // ...(sort === 'barcode' ? {barcode: direction} : {}),
      ...(sort === 'category' ? {product: { category: {name: direction}} } : {}),
      ...(sort === 'brand' ? {product: { brand: {name: direction}} } : {}),
      ...(sort === 'quantity' ?  { quantity: direction } : {})
    }
  }

  const productsStocks = await prisma.productStock.findManyAndCount({
    where: {
      storeId: 1,
      outletId: Number(outletId),
      product: {
        AND: [
          {...(brandId !== "" && brandId !== undefined && brandId !== null ? { brandId: Number(brandId)} : {})},
          {...(categoryId !== "" && categoryId !== undefined && categoryId !== null ? { categoryId: Number(categoryId) } : {})},
          {...(search !== null ? { OR: [
              { name: { contains: search } },
              { sku: search },
              { barcode: search }
            ] } : {})
          }
        ]
      }
    },
    orderBy,
    include: {
      product: {
        select: {
          name: true,
          id: true,
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
      },
      stockMovements: {
        where: {
          moveDateStr
        },
        orderBy: {
          id: 'asc'
        }
      }
    }
  })

  productsStocks.push(page)
  productsStocks.push(limit)

  return NextResponse.json(productsStocks);

/*

  if(
    !isEmptyVal(sort) && specialSorts.indexOf(sort) > -1
  ){
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
        ...(sort === 'sellPrice' ? {sellPrice: direction === "asc" ? "asc" : "desc"} : {}),
        ...(sort === 'quantity' ? {quantity: direction === "asc" ? "asc" : "desc"} : {}),
        ...(sort === 'discountPercentage' ? {discountPercentage: direction === "asc" ? "asc" : "desc"} : {}),
        ...(sort === 'markupPercentage' ? {markupPercentage: direction === "asc" ? "asc" : "desc"} : {}),
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
    isSortedByStockField = true
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
          discountPercentage: true,
          stockMovements: {
            where: {
              moveDate
            }
          }
        }
      }
    },
    ...(!isSortedByStockField ? {skip: (page - 1) * limit} : {}),
    ...(!isSortedByStockField ? {take: limit} : {} ),
  });

  if(isSortedByStockField){
    products[1] = count

    if(direction === 'asc'){
      products[0].sort((a, b) => (Number(a.stocks[0][sort as keyof typeof a.stocks[0]]) - Number(b.stocks[0][sort as keyof typeof b.stocks[0]])))
    } else {
      products[0].sort((a, b) => (Number(b.stocks[0][sort as keyof typeof b.stocks[0]]) - Number(a.stocks[0][sort as keyof typeof a.stocks[0]])))
    }
  }

  products.push(page)
  products.push(limit)
  return NextResponse.json(products);

  */
  
}