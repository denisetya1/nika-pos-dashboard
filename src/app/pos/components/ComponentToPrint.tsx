'use client'

import React from 'react'

class ComponentToPrint extends React.Component {
  render (){
    return (<div>
      <div className="logo flex justify-center py-5">
        <img
                  alt="NIKA POS - BEAUTYCAT"
                  height="24"
                  src="/receipt-logo.png"
                  width="150"
                />
      </div>
      <div className='border-y-[2px] p-3'>
        1234567
      </div>
      <div className='p-3'>
        <div className='flex justify-between align-top'>
          <div>1 Testing produk @20000</div><div>20000</div>
        </div>
        <div className='flex justify-between align-top'>
          <div>2 Testing produk A @25000</div><div>50000</div>
        </div>
        <div className='flex justify-between align-top'>
          <div>1 Testing produk C @10000</div><div>10000</div>
        </div>
      </div>
      <div className='border-y-[2px] p-3'>
        Total
      </div>
    </div>)
  }
}

export default ComponentToPrint