'use client';

import React, { useEffect, useState } from "react"
import { Outlet } from "@prisma/client"
import { Alert, Button, Label, Select, TextInput } from "flowbite-react"
import DatePicker from "react-datepicker"
import { usePathname, useRouter } from "next/navigation"
import queryString from "query-string"
import moment from "moment"
import { Input } from "postcss";

const OutletDateRangeFilter = ({
  outlets,
  selectedOutlet,
  selectedStartDate,
  selectedEndDate,
  searched
} : {
  outlets?: Outlet[]
  selectedOutlet?: string | undefined
  selectedStartDate?: string
  selectedEndDate?: string,
  searched?: string
}) => {
  const router = useRouter();
  const pathname = usePathname()
  const [outletId, setOutletId] = useState(selectedOutlet);
  const [search, setSearch] = useState(searched);

  const [dateRange, setDateRange] = useState<(Date|null)[]>([new Date(selectedStartDate || ''), new Date(selectedEndDate || "")]);
  const [startDate, endDate] = dateRange;

  const submitFIlter = () => {
    if(startDate !== null && endDate !== null){
      const query = {
        outletId,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        search
      }

      const qs = queryString.stringify(query, {
        skipEmptyString: true,
        skipNull: true
      })

    
      router.push(`${pathname}?${qs}`)
      router.refresh()
    } else {
      alert("Pilih Tanggal Mulai dan Tanggal Berakhir!")
    }
  }

  return (
    <div className="flex flex-row justify-start gap-5 items-center mb-8">

      {outlets && outlets?.length > 0 ? <div>
        <div className="mb-2 block">
          <Label className="text-slate-600" htmlFor="product-name" value="Outlet" />
        </div>
        <Select color="info" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOutletId(e.target.value)} value={outletId}>
          {outlets.map((outlet) => (<option key={outlet.id} value={outlet.id.toString()}>{outlet.name}</option>))}
        </Select>
        </div>: <></>}

      <div className="w-[250px]">
        <div className="mb-2 block">
          <Label className="text-slate-600" htmlFor="product-name" value="Cari Produk" />
        </div>
        <TextInput id="product-name" className="w-full" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} type="text" placeholder="Cari berdasarkan nama produk/barcode/sku"/>
      </div>

      <div>
        <div className="mb-2 block">
          <Label className="text-slate-600" htmlFor="product-name" value="Pilih Tanggal" />
        </div>

        <DatePicker
          selectsRange={true}
          startDate={startDate || undefined}
          endDate={endDate || undefined}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
          className="border-[1px] border-slate-300 p-[10px] pr-5 rounded-lg w-[260px] bg-slate-50 text-sm"
          dateFormat="d MMM Y"
        />
      </div>

      <div>
        <div className="mb-2 block">&nbsp;</div>
        <Button onClick={submitFIlter} >Tampilkan</Button>
      </div>
    </div>
  )
}

export default  OutletDateRangeFilter