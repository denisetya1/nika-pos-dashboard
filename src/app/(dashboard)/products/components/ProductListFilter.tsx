'use client';

import React, { useEffect, useState } from "react"
import { Brand, Category, Outlet } from "@prisma/client"
import { Label, Select, TextInput } from "flowbite-react"
import { useRouter } from "next/navigation";
import queryString from "query-string";

const ProductListFilter = ({
  categories, 
  brands, 
  selectedCategory, 
  selectedBrand, 
  searchProduct,
  outlets,
  selectedOutlet,
  pageURL,
} : {
  categories: Category[]
  brands: Brand[]
  outlets?: Outlet[] | undefined
  selectedCategory: string | undefined
  selectedBrand: string | undefined
  selectedOutlet?: string | undefined
  searchProduct: string | undefined
  pageURL?: string | undefined
}) => {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(selectedCategory);
  const [brandId, setBrandId] = useState(selectedBrand);
  const [search, setSearch] = useState(searchProduct || '');
  const [outletId, setOutletId] = useState(selectedOutlet);

  useEffect(() => {
    const query = {
      categoryId,
      brandId,
      outletId,
      search,
    }

    const qs = queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true
    })

    router.push(`${pageURL}?${qs}`)
  }, [categoryId, brandId, search, outletId, pageURL, router])

  return (
    <div className="sm:flex flex-row justify-start gap-5 items-center mb-8">

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

      <div className="grow">
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Cari Produk" />
        </div>
        <TextInput id="product-name" className="w-full" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} type="text" placeholder="Cari berdasarkan nama produk/barcode/sku"/>
      </div>
    </div>
  )
}

export default ProductListFilter