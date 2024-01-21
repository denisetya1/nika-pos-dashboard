'use client'

import { formatCurrency, getFinalPrice, isEmptyVal } from "@/app/helpers/functions";
import { Brand, Category, Outlet, Prisma } from "@prisma/client";
import { Button, Label, Select, TextInput } from "flowbite-react";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import ComponentToPrint from "./components/ComponentToPrint";
import { useReactToPrint } from "react-to-print";


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

const PrintPricePage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brandId, setBrandId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [outletId, setOutletId] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [productPrices, setProductPrices] = useState<ProductStock[]>([])
  const componentRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getOutlets = () =>  { 
    fetch(`/api/outlets`, {
      cache: 'no-cache'
    }).then((res) => res.json())
    .then((data) => {
      setOutlets(data)
      setOutletId(data[0].id)
    })
  }
 
  const getBrands = () =>  { 
    fetch(`/api/brands`, {
      cache: 'no-cache'
    }).then((res) => res.json())
    .then((data) => {
      setBrands(data)
    })
  }

  const getCategories = () => { 
    fetch(`/api/categories`, {
      cache: 'no-cache'
    }).then((res) => res.json())
    .then((data) => {
      setCategories(data)
    })
  }

  useEffect(() => {
    getOutlets()
    getBrands()
    getCategories()
  }, [])

  useEffect(() => {
    if(outletId !== null)
      findProductPrice(outletId)
  }, [outletId, brandId, categoryId])

  const query = queryString.stringify({
    outletId,
    brandId,
    categoryId,
    searchProduct
  }, {
    skipEmptyString: true,
    skipNull: true
  });

  const findProductPrice = (outletId: Number | string) => {
    fetch(`/api/products/prices/${outletId}${query !== '' ? `?${query}` : ''}`, {
      cache: 'no-cache'
    }).then((res) => res.json())
    .then((data) => {
      setProductPrices(data)
    })
  }

  return (
    <div  className="p-5 sm:p-8 md:p-10 lg:p-20">
      <div>
        <h1 className="font-bold text-2xl mb-10">CETAK HARGA PRODUK</h1>
      </div>

      <div>
        <div className="sm:flex flex-row justify-start gap-5 items-center mb-8">

          {outlets && outlets?.length > 0 && <div>
            <div className="mb-2 block">
              <Label htmlFor="product-name" value="Outlet" />
            </div>
            
              <Select color="info" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOutletId(e.target.value)} value={outletId}>
                {outlets.map((outlet) => (<option key={outlet.id} value={outlet.id.toString()}>{outlet.name}</option>))}
              </Select>
          </div>} 

          {categories && categories?.length > 0 && <div> 
            <div className="mb-2 block">
              <Label htmlFor="product-name" value="Ketegori" />
            </div>
            <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)} value={categoryId}>
              <option value="">Semua Kategori</option>
              {categories.map((category) => (<option key={category.id} value={category.id.toString()} >{category.name}</option>))}
            </Select>
          </div>}

          {brands && brands?.length > 0 && <div>
            <div className="mb-2 block">
              <Label htmlFor="product-name" value="Brand" />
            </div>
              <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandId(e.target.value)} value={brandId}>
              <option value="">Semua Brand</option>
              {brands.map((brand) => (<option key={brand.id} value={brand.id.toString()} >{brand.name}</option>))}
            </Select>
          </div>}
          
        </div>
      </div>

      <div className="w-full">
          <div className="flex justify-end align-middle mb-5">
            <Button color="blue" onClick={handlePrint}>Cetak Label</Button>
          </div>
          <ComponentToPrint ref={componentRef} productPrices={productPrices}/>
        </div>
           
      {/* <div className="grid grid-cols-4 gap-0"> */}
        
        {/* { productPrice.map((pp) => <div className="relative flex flex-col justify-between align-top h-[150px] border-r-[1px] border-b-[1px] border-dashed border-gray-100 p-3">
            <div className="text-sm">{pp.product.name}</div>

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
              <img
                    alt="NIKA POS - BEAUTYCAT"
                    height="24"
                    src="/receipt-logo.png"
                    width="30"
                  />
            </div>
          </div>
          )} */}
      </div>
    // </div>
  )
}

export default PrintPricePage