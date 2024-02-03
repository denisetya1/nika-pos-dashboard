'use client';

import React, { useEffect, useState } from "react"
import { Brand, Category, Outlet } from "@prisma/client"
import { Datepicker, Label, Select, TextInput } from "flowbite-react"
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import moment from "moment";

const StockListFilter = ({
  categories, 
  brands, 
  selectedCategory, 
  selectedBrand, 
  searchProduct,
  outlets,
  selectedOutlet,
  selectedDate,
} : {
  categories: Category[]
  brands: Brand[]
  outlets?: Outlet[] | undefined
  selectedCategory: string | undefined
  selectedBrand: string | undefined
  selectedOutlet?: string | undefined
  searchProduct: string | undefined
  selectedDate?: string
}) => {
  const router = useRouter();
  const pathname = usePathname()
  const [categoryId, setCategoryId] = useState(selectedCategory);
  const [brandId, setBrandId] = useState(selectedBrand);
  const [search, setSearchProduct] = useState(searchProduct);
  const [outletId, setOutletId] = useState(selectedOutlet);
  const [moveDateStr, setMoveDateStr] = useState(selectedDate)

  useEffect(() => {
    const query = {
      categoryId,
      brandId,
      outletId,
      search,
      moveDateStr
    }

    const qs = queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true
    })

    router.push(`${pathname}?${qs}`)
    router.refresh()
  }, [categoryId, brandId, search, outletId, router, moveDateStr])

  return (
    <div className="flex flex-row justify-start gap-5 items-center mb-8">

      {outlets && outlets?.length > 0 ? <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Outlet" />
        </div>
        <Select color="info" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOutletId(e.target.value)} value={outletId}>
          {outlets.map((outlet) => (<option key={outlet.id} value={outlet.id.toString()}>{outlet.name}</option>))}
        </Select>
        </div>: <></>} 
      
      <div> 
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Ketegori" />
        </div>
        <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)} value={categoryId}>
          <option value="">Semua Kategori</option>
          {categories.map((category) => (<option key={category.id} value={category.id.toString()} >{category.name}</option>))}
        </Select>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Brand" />
        </div>
          <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandId(e.target.value)} value={brandId}>
          <option value="">Semua Brand</option>
          {brands.map((brand) => (<option key={brand.id} value={brand.id.toString()} >{brand.name}</option>))}
        </Select>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Cari Produk" />
        </div>
        <TextInput id="product-name" className="w-80" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchProduct(e.target.value)} type="text" placeholder="Cari berdasarkan nama produk/barcode/sku"/>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Tanggal Laporan" />
        </div>
        <Datepicker 
          language="en-ID" 
          labelTodayButton="Hari Ini" 
          labelClearButton="Batal" 
          defaultDate={new Date(moment(selectedDate).format())}
          weekStart={1}
          onSelectedDateChanged={(d) => setMoveDateStr(moment(d).format('YYYY-MM-DD'))}
        />
      </div>
    </div>
  )
}

export default  StockListFilter