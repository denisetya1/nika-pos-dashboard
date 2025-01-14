'use client'

import { Brand, Category, Outlet, Prisma } from "@prisma/client";
import { Button, TextInput, Select } from "flowbite-react";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import ComponentToPrint from "./components/ComponentToPrint";
import { useReactToPrint } from "react-to-print";
import { useQuery } from "@tanstack/react-query";
import PrintBarcode from "./components/PrintBarcode";

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

const PrintPricePage = () => {
  const [discVal, setDiscVal] = useState(1000)
  const componentRef = useRef(null);


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="grow">
      <div>
        <h1 className="font-bold text-2xl mb-10">CETAK HARGA PRODUK</h1>
      </div>

      <div className="w-full bg-white p-6 rounded-md border-[1px] border-slate-200">
        <div className="flex justify-between p-2 items-center">
          <div className="w-30 flex justify-center items-center gap-2">
            <div>Nilai Diskon</div>
            <div><TextInput max={10000} onChange={(e: any) => setDiscVal(e.target.value)} type="text" value={discVal} name="discVal" /></div>
          </div>
          <div className="flex justify-end align-middle mb-5">
            <Button color="purple" onClick={handlePrint}>Cetak Label</Button>
          </div>
        </div>
        {/* <ComponentToPrint ref={componentRef} discountVal={Number(discVal)} /> */}
        <PrintBarcode ref={componentRef} />
      </div>

    </div>
  )
}

export default PrintPricePage