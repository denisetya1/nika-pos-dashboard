'use client'

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "./components/ComponentToPrint";
import useProducts from "../hooks/useProducts";

const POSPage = () => {
  const [ search, setSearch ] = useState('')
  const [ brandId, setBrandId ] = useState()
  const [ categoryId, setCategoryId ] = useState()

  const { data: products, isLoading } = useProducts({
    search,
    brandId,
    categoryId,
    limit: 20,
    page: 1
  })


  return (
    <div className="w-full h-screen flex justify-start align-top">
      <div className="receipt w-[400px] h-screen p-8">
        <div className="receipt-logo">
          
          <div>
          </div>
        </div>
      </div>
      <div className="product-list grow h-screen bg-blue-300 p-10">
        dsa
      </div>
    </div>
  )
}

export default POSPage