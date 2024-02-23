'use client';

import React, { useEffect, useState } from "react"
import { Brand, Category, Outlet } from "@prisma/client"
import { Datepicker, Label, Select, TextInput } from "flowbite-react"
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import moment from "moment";

type IdName = {
  id: Number | string,
  name: string 
}

const StockListFilter = ({
  users, 
  shifts, 
  payments, 
  outlets,
  selectedUser,
  selectedShift,
  selectedPayment,
  selectedOutlet,
  selectedDate,
} : {
  users: IdName[]
  shifts: IdName[]
  payments: IdName[]
  outlets?: Outlet[]
  selectedUser: string | undefined
  selectedShift: string | undefined
  selectedOutlet?: string | undefined
  selectedPayment: string | undefined
  selectedDate?: string
}) => {
  const router = useRouter();
  const pathname = usePathname()
  const [userId, setuserId] = useState(selectedUser);
  const [shiftId, setShiftId] = useState(selectedShift);
  const [paymentId, setPaymentId] = useState(selectedPayment);
  const [outletId, setOutletId] = useState(selectedOutlet);
  const [date, setDate] = useState(selectedDate)

  useEffect(() => {
    const query = {
      userId,
      shiftId,
      outletId,
      paymentId,
      date
    }

    const qs = queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true
    })

    router.push(`${pathname}?${qs}`)
    router.refresh()
  }, [userId, shiftId, outletId, paymentId, date, router])

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
          <Label htmlFor="product-name" value="kasir" />
        </div>
        <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setuserId(e.target.value)} value={userId}>
          <option value="">Semua User</option>
          {users.map((user) => (<option key={user.id as string} value={user.id.toString()} >{user.name}</option>))}
        </Select>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Shift" />
        </div>
          <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShiftId(e.target.value)} value={shiftId}>
          <option value="">Semua Shift</option>
          {shifts.map((shift) => (<option key={shift.id as string} value={shift.id.toString()} >{shift.name}</option>))}
        </Select>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Pembayaran" />
        </div>
          <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentId(e.target.value)} value={paymentId}>
          <option value="">Semua Pembyaran</option>
          {payments.map((payment) => (<option key={payment.id as string} value={payment.id.toString()} >{payment.name}</option>))}
        </Select>
      </div>

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