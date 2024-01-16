import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../client";


export const GET = async (req: NextRequest) =>  {
  const categoryId = req.nextUrl.searchParams.get('categoryId');
  const brandId = req.nextUrl.searchParams.get('brandId');
  const search = req.nextUrl.searchParams.get('search');

  // const error = true;

  // if(error){
  //   return NextResponse.json({error: true, message: "Messagenya", errors: []});
  // }
  if(brandId === '' || brandId === null || brandId === undefined){
    return NextResponse.json([]);
  }

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
      brand: true,
      category: true
    }
  });

  return NextResponse.json(products);
}

export const POST = async (request: Request) =>  {
  const body = await request.json()

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      categoryId: body.categoryId,
      brandId: body.brandId,
      sku: body.sku,
      barcode: body.barcode,
      isActive: true,
      storeId: 1,
    }
  })


  return NextResponse.json(product);
}
