'use client';

import React, { useEffect, useState } from "react"
import { Brand, Category, Outlet } from "@prisma/client"
import { Label, Select, TextInput } from "flowbite-react"
import { useRouter } from "next/navigation";
import queryString from "query-string";

const NameFilter = ({
  searchName,
  pageURL,
  placeholder,
  label,
} : {
  searchName?: string
  pageURL?: string
  placeholder?: string
  label?: string
}) => {
  const router = useRouter();
  const [search, setSearch] = useState(searchName);


  useEffect(() => {
    const query = {
      search,
    }

    const qs = queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true
    })

    router.push(`${pageURL}?${qs}`)
  }, [search, pageURL, router])

  return (
    <div className="flex flex-row justify-start gap-5 items-center mb-8">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value={label ? label : "Cari Nama"} />
        </div>
        <TextInput id="product-name" className="w-80" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} type="text" placeholder={placeholder ? placeholder : "Cari Nama"}/>
      </div>
    </div>
  )
}

export default NameFilter