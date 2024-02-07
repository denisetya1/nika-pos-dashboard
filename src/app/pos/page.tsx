'use client'

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "./components/ComponentToPrint";
import useProducts from "../hooks/useProducts";
import { Product } from "@prisma/client";

type ProductSales = {
  qty: number
  & Product
}

const POSPage = () => {
  const [ search, setSearch ] = useState('')
  const [ brandId, setBrandId ] = useState('')
  const [ categoryId, setCategoryId ] = useState('')
  const [ outletId, setOutletId ] = useState('')
  const [ sales, setSales ] = useState<ProductSales[]>([])

  const { data: products, isLoading } = useProducts({
    search,
    brandId,
    categoryId,
    outletId,
    limit: 20,
    page: 1
  })

  return (
    <div className="w-full h-screen flex justify-start align-top">
      <div className="receipt w-[400px] h-screen p-8">
        {/* <ComponentToPrint sales={sales}/> */}
      </div>

      <div className="product-list grow h-screen bg-blue-300 p-10">
        dsa
      </div>
    </div>
  )
}

export default POSPage