'use client'
import React from 'react'
import Barcode from 'react-barcode';


class PrintBarcode extends React.Component {

  render(): React.ReactNode {
    const range = Array.from({ length: 6 }, (x, i) => i);

    return (<div className="grid grid-cols-2 gap-20 w-full">
      {range.map((val, index) => <div key={index} className={`relative 
        flex flex-col justify-center items-center h-[100px] 
        border-[1px] border-dashed border-gray-200 p-3 ${(index + 1) % 55 === 0 ? 'mb-[20px]' : ''} `}
      >
        <div className='font-bold mb-1'>Potongan Rp {((val + 1) * 1000).toLocaleString('ID')}</div>
        <Barcode height={65} width={3} displayValue={false} value={`DISKON${(val + 1) * 1000}`} />
      </div>)}
    </div>)
  }
}

export default PrintBarcode