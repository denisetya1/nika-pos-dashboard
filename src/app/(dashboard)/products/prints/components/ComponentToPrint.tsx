'use client'

import { getFinalPrice, isEmptyVal } from '@/lib/functions';
import { Prisma } from '@prisma/client';
import React from 'react'
import Image from "next/image";
import Barcode from 'react-barcode';
import { HiTrash } from 'react-icons/hi2';
import { Button } from 'flowbite-react';

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

  render() {
    return (
      <div className="grid grid-cols-4 gap-0 w-full">
        {this.props.productPrices.map((pp, index) => <div key={pp.id} className={`relative flex flex-col justify-between align-top h-[150px] border-[1px] border-dashed border-gray-200 p-3 ${(index + 1) % 28 === 0 ? 'mb-[61px]' : ''} `}>
          <div className="text-sm capitalize">
            {pp.product.priceTagLabel !== '' && pp.product.priceTagLabel !== null ? pp.product.priceTagLabel : pp.product.name.substring(0, 80).toLowerCase()}
          </div>

          <div className="grow">
            <div className="flex flex-col h-full justify-center align-middle text-right">
              {
                !isEmptyVal(pp.markupPercentage, true) && !isEmptyVal(pp.markupPercentage, true) &&
                <div className="text-xs">
                  <span className="line-through">{getFinalPrice(Number(pp.sellPrice), pp.markupPercentage, 0, false, true)}</span>
                  <span> (<span className='text-red-700'>-{pp.discountPercentage}%</span>)</span>
                </div>
              }
              <div className="font-bold mb-2">
                {getFinalPrice(Number(pp.sellPrice), pp.markupPercentage, pp.discountPercentage, true, true)}
              </div>
            </div>
          </div>
          <div>
            {/* {pp.product.barcode !== null && pp.product.barcode !== '' && <Barcode height={15} width={1} displayValue={false} value={pp.product.barcode} />} */}
          </div>

          <div className="absolute bottom-2 right-2">
            <Image
              alt="NIKA POS - BEAUTYCAT"
              height="24"
              src="/receipt-logo.png"
              width="30"
            />
          </div>

          <button className='absolute print:hidden bottom-2 left-1 px-[0px]' color='light'>
            <HiTrash />
          </button>
        </div>
        )}
      </div>
    )
  }
}

export default ComponentToPrint