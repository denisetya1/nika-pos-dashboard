'use client';

import React, { useEffect, useState } from "react"
import { Outlet } from "@prisma/client"
import { Datepicker, Label, Select } from "flowbite-react"
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import moment from "moment";

type IdName = {
  id: Number | string,
  name: string 
}

const StockListFilter = ({
  outlets,
  selectedOutlet,
  selectedDate,
} : {
  outlets?: Outlet[]
  selectedOutlet?: string | undefined
  selectedDate?: string
}) => {
  const router = useRouter();
  const pathname = usePathname()
  const [outletId, setOutletId] = useState(selectedOutlet);
  const [date, setDate] = useState(selectedDate)

  useEffect(() => {
    const query = {
      outletId,
      date
    }

    const qs = queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true
    })

    router.push(`${pathname}?${qs}`)
    router.refresh()
  }, [outletId, date, router])

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
          <Label htmlFor="product-name" value="Tanggal Laporan" />
        </div>
        <Datepicker 
          language="en-ID" 
          labelTodayButton="Hari Ini" 
          labelClearButton="Batal" 
          defaultDate={new Date(date || '')}
          weekStart={1}
          onSelectedDateChanged={(d) => setDate(moment(d).format('YYYY-MM-DD'))}
        />
      </div>
    </div>
  )
}

export default  StockListFilter