'use client'

import { getFinalPrice, isEmptyVal } from '@/lib/functions';
import { Prisma } from '@prisma/client';
import React from 'react'
import Image from "next/image";

type MyProps = {
  discountVal: number
}

class ComponentToPrint extends React.Component<MyProps> {
  constructor(props: MyProps) {
    super(props);
  }

  // renderCard(val: number, index: number) {
  //   return (
  //     <div className="grid grid-cols-4 gap-0 w-full">
  //       {this.props.productPrices.map((pp, index) => <div key={pp.id} className={`relative flex flex-col justify-between align-top h-[150px] border-[1px] border-dashed border-gray-200 p-3 ${(index + 1) % 28 === 0 ? 'mb-[61px]' : ''} `}>
  //         <div className="text-sm capitalize">
  //           {pp.product.priceTagLabel !== '' && pp.product.priceTagLabel !== null ? pp.product.priceTagLabel : pp.product.name.substring(0, 80).toLowerCase()}
  //         </div>

  //         <div className="grow">
  //           <div className="flex flex-col h-full justify-center align-middle text-right">
  //             {
  //               !isEmptyVal(pp.markupPercentage, true) && !isEmptyVal(pp.markupPercentage, true) &&
  //               <div className="text-xs">
  //                 <span className="line-through">{getFinalPrice(Number(pp.sellPrice), pp.markupPercentage, 0, false, true)}</span>
  //                 <span> (<span className='text-red-700'>-{pp.discountPercentage}%</span>)</span>
  //               </div>
  //             }
  //             <div className="font-bold mb-2">
  //               {getFinalPrice(Number(pp.sellPrice), pp.markupPercentage, pp.discountPercentage, true, true)}
  //             </div>
  //           </div>
  //         </div>
  //         <div>
  //           {/* {pp.product.barcode !== null && pp.product.barcode !== '' && <Barcode height={15} width={1} displayValue={false} value={pp.product.barcode} />} */}
  //         </div>

  //         <div className="absolute bottom-2 right-2">
  //           <Image
  //             alt="NIKA POS - BEAUTYCAT"
  //             height="24"
  //             src="/receipt-logo.png"
  //             width="30"
  //           />
  //         </div>

  //         <button className='absolute print:hidden bottom-2 left-1 px-[0px]' color='light'>
  //           <HiTrash />
  //         </button>
  //       </div>
  //       )}
  //     </div>
  //   )
  // }

  render(): React.ReactNode {
    const range = Array.from({ length: 110 }, (x, i) => i);

    return (<div className="grid grid-cols-5 gap-0 w-full">
      {range.map((val, index) => <div key={index} className={`relative 
        flex flex-col justify-center items-center h-[100px] 
        bg-[url(/disc-bg.jpg)] bg-top-center bg-[length:100%_80px] bg-no-repeat
        border-[1px] border-dashed border-gray-200 p-3 ${(index + 1) % 55 === 0 ? 'mb-[20px]' : ''} `}
      >
        <div className='font-bold mb-1'>Potongan</div>
        <div className='font-bold text-lg'>Rp {this.props.discountVal.toLocaleString('ID')},-</div>

        <div className="absolute bottom-2 right-2">
          <Image
            alt="NIKA POS - BEAUTYCAT"
            height="24"
            src="/receipt-logo.png"
            width="30"
          />
        </div>
      </div>)}
    </div>)
  }
}

export default ComponentToPrint