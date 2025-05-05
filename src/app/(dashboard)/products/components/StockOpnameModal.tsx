'use client';

import { history } from "@/types/common";
import { Outlet, Prisma, ProductStock } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Tooltip } from "flowbite-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { LuHistory } from "react-icons/lu";

type Product = Prisma.ProductGetPayload<{
  include: { brand: true, category: true, stocks: true }
}>

type FormValues = {
  quantity: String
  moveTypeId: String
  description: String
  outletId: String
  productId: String
  productStockId: String
  outletDestinationId: String
  withPrice: String
}

const StockOpnameModal = ({
  outlet,
  product,
  productStock,
  disabled,
  currentQuantity,
}:
  {
    outlet: Outlet
    product: Product
    currentQuantity: number
    productStock?: ProductStock
    disabled?: boolean
  }) => {
  const [isOpen, setOpen] = useState(false)
  const [dateRange, setDateRange] = useState<(Date | null)[]>([new Date(moment().subtract(30, 'days').format('YYYY-MM-DD')), new Date(moment().format('YYYY-MM-DD'))]);
  const [startDate, endDate] = dateRange;
  const [totalIn, setTotalIn] = useState(0);
  const [totalOut, setTotalOut] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['stockOpname', product.id, outlet.id, startDate, endDate],
    queryFn: async () => {
      if (startDate !== null && endDate !== null) {
        // alert(`/api/products/${product.id}/${outlet.id}/opname?startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${endDate}`);
        const res = await fetch(`/api/products/${product.id}/${outlet.id}/opname?startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`, {
          method: 'GET',
        })
          .then((res) => res.json())
          .then(resJson => {
            return resJson
          })
        return res
      } else {
        return []
      }
    },
  })
  useEffect(() => {
    if (data) {
      let countIn = 0;
      let countOut = 0;

      data.map((h: history) => {
        if (h.direction === 'IN') {
          countIn += h.qty
        } else {
          countOut += h.qty
        }
      })

      setTotalIn(countIn)
      setTotalOut(countOut)

    }
  }, [data, isLoading, isError])

  return (
    <>
      <Tooltip content={'Lihat History'} placement="bottom" style="light">
        <Button color="light" disabled={disabled} onClick={() => setOpen(true)}>
          <LuHistory />
        </Button>
      </Tooltip>

      <Modal className="w-full" show={isOpen} onClose={() => setOpen(false)}>
        <Modal.Header>STOK HISTORY</Modal.Header>
        <Modal.Body className="dark:text-gray-300 max-h-[500px] overflow-auto">
          <div className="mb-5 w-full p-2 bg-gray-50 font-semibold">
            <div className="w-full flex justify-start items-start gap-2 "> <div>Nama Produk: </div><div>{product.name}</div></div>
            <div className="w-full flex justify-start items-start gap-2 "><div>Stok Terakhir: </div><div>{productStock?.quantity}</div></div>
          </div>

          <div>
            <div>Pilih Tanggal: </div>
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

          {isLoading && <div className="w-full flex justify-center items-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div></div>}

          {!isLoading && <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-md overflow-hidden">
            <thead>
              <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-top-[1px] border-slate-200 rounded-md">
                <th scope="col" className="w-[40px] px-4 py-5">No.</th>
                <th scope="col" className="px-4 py-5 hover:bg-gray-200">
                  No. Transaksi
                </th>
                <th scope="col" className="hidden sm:table-cell px-4 py-5 hover:bg-gray-200">
                  Tanggal
                </th>
                <th scope="col" className="hidden sm:table-cell px-4 py-5 hover:bg-gray-200">
                  QTY
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data && data.length > 0 && data.map((h: history, idx: number) => {
                return (
                  <tr key={idx}>
                    <td className="text-center" valign="top">{idx + 1}</td>
                    <td valign="top">
                      {h.transactionId}
                      {h.description && <div className="text-xs">{h.description}</div>}
                    </td>
                    <td valign="top">{moment(h.date).format('DD-MM-YYYY HH:mm:ss')}</td>
                    <td valign="top" className={`${h.direction === 'OUT' ? 'text-red-600' : 'text-blue-500'} text-center`}>{`${h.direction === 'OUT' ? '-' : '+'}${h.qty}`}</td>
                  </tr>)

              })}
            </tbody>
            <tfoot className="bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <td colSpan={3} className="text-right font-semibold">Total Stok Masuk: </td>
                <td className="text-center font-semibold">{totalIn}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-right font-semibold">Total Stok Keluar: </td>
                <td className="text-center font-semibold">{totalOut}</td>
              </tr>
            </tfoot>
          </table>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpen(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default StockOpnameModal