'use client'

import { formatCurrency, getFinalPrice, isEmptyVal } from '@/app/helpers/functions';
import { Prisma } from '@prisma/client';
import React from 'react'
import Image from "next/image";

type ProductStock = Prisma.ProductStockGetPayload<{
  include: { 
    product: {
      include: {
        brand: true,
        categories: true
      }
    }
  }
}>

type MyProps = {
  productPrices: ProductStock[]
}

class ComponentToPrint extends React.Component<MyProps> {
  constructor(props: MyProps) {
    super(props);
  }

  render (){
    return (
      <div className="grid grid-cols-4 gap-0 w-full">
        { this.props.productPrices.map((pp) => <div key={pp.id} className="relative flex flex-col justify-between align-top h-[150px] border-r-[1px] border-b-[1px] border-dashed border-gray-100 p-3">
            <div className="text-sm">{pp.product.name.substring(0,36)}</div>

            <div className="grow">
              <div className="flex flex-col h-full justify-center align-middle text-right">
                {
                  !isEmptyVal(pp.markupPercentage, true) && !isEmptyVal(pp.markupPercentage, true) &&
                  <div className="text-xs line-through">
                    {getFinalPrice(Number(pp.sellPrice), pp.markupPercentage, 0, false, true)}
                  </div>
               }
                <div className="font-bold mb-2">
                  {getFinalPrice(Number(pp.sellPrice), pp.markupPercentage, pp.discountPercentage, true, true)}
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 right-2">
              <Image
                    alt="NIKA POS - BEAUTYCAT"
                    height="24"
                    src="/receipt-logo.png"
                    width="30"
                  />
            </div>
          </div>
          )}
      </div>
    )
  }
}

export default ComponentToPrint