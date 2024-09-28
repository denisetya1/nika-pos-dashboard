import { formatCurrency } from "@/lib/functions";
import { Outlet, Prisma, Shift, User } from "@prisma/client"
import moment from "moment";
import { Tooltip } from "flowbite-react";
import { TbListDetails } from "react-icons/tb";
import TransactionDetailsModal from "../components/TransactionDetailsModal";
import { getCookieString } from "@/actions/Cookies";
import OnlineSalesFilter from "../components/OnlineSalesFilter";

type Transaction = Prisma.TransactionGetPayload<{
  include: { 
    user: true,
    outlet: true,
    userShift: {
      include: {
        shift: true,
      }
    },
    outletPaymentMethod: {
      include: {
        paymentMethod: true
      }
    },
    transactionDetails: true
  }
}>

interface TotalByPayment {
  [key: string]: any
}


const StockReportPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const requestHeaders: HeadersInit = new Headers()
  requestHeaders.set('Cookie', getCookieString())
  
  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId
  
  const date = searchParams?.date || moment().format('YYYY-MM-DD')
  const userId = searchParams?.userId
  const marketPlace = searchParams?.marketPlace
  const courier = searchParams?.courier
  const shiftId = searchParams?.shiftId

  const resSales = await fetch(
    `${process.env.URL}/api/reports/sales?outletId=${outletId}&date=${date}&online=1`, 
    {
      headers: requestHeaders,
      cache: 'no-cache'
    }
  )

  const transactions: Transaction[] = await resSales.json()

  const getFilterAndTotal = (data: Transaction[]) => {
    let countAll = 0
    let totalAll = 0

    const shifts: Shift[] = []
    const users: User[] = []

    const marketPlaces: string[] = []
    const couriers: string[] = []
    const countByMarketPlace: { name: string, value: number }[] = []
    const countByCourier: { name: string, value: number }[] = []

    data.map((tr) => {
      const mp = tr.cardNumber?.split('/') || []
      const cr = tr.confirmNumber?.split('/') || []

      totalAll += Number(tr.totalPrice)
      countAll++

      if(!shifts.find((s) => s.id === tr.userShift.shift.id)){
        shifts.push(tr.userShift.shift)
      }
      if(!users.find((u) => u.id === tr.user.id)){
        users.push(tr.user)
      }

      if(marketPlaces.indexOf(mp[0]) < 0){
        marketPlaces.push(mp[0])
      }

      const findMpIndex = countByMarketPlace.findIndex((item) => item.name === mp[0])
      if(findMpIndex > -1){
        countByMarketPlace[findMpIndex].value += 1
      } else {
        countByMarketPlace.push({
          name: mp[0], value: 1
        })
      }

      if(couriers.indexOf(cr[0]) < 0){
        couriers.push(cr[0])
      } 
      const findCrIndex = countByCourier.findIndex((item) => item.name === cr[0])
      if(findCrIndex > -1){
        countByCourier[findCrIndex].value += 1
      } else {
        countByCourier.push({
          name: cr[0], value: 1
        })
      }

    })

    return {
      shifts,
      users,
      marketPlaces,
      couriers,
      countByMarketPlace,
      countByCourier,
      countAll,
      totalAll,
    }
  }

  const {
    shifts,
    users,
    marketPlaces,
    couriers,
    countByMarketPlace,
    countByCourier,
    countAll,
  } = getFilterAndTotal(transactions)

  const filteredList = transactions.filter((tx) => {
      let filterUser = true;
      let filterShift = true;
      let filterPayment = true;
      
      if(userId && tx.userId !== userId) {
        filterUser = false
      }

      if(shiftId && String(tx.userShift.shiftId) !== shiftId) {
        filterUser = false
      }

      if(marketPlace && !tx.cardNumber?.includes(marketPlace)) {
        filterUser = false
      }

      if(courier && !tx.confirmNumber?.includes(courier)) {
        filterUser = false
      }

      return filterUser && filterShift && filterPayment

    })
  
  const {
    totalAll: totalAllFiltered,
  } = getFilterAndTotal(filteredList)

  return (
    <div className="grow min-h-[500px]">
      <div>
        <h1 className="font-bold text-2xl mb-10">Laporan Penjualan Online Harian</h1>
      </div>

      <div>
        <OnlineSalesFilter 
          outlets={outlets}
          users={users.map((u) => ({
            id: u.id,
            name: u.name,
          }))}
          shifts={shifts.map((s) => ({
            id: Number(s.id),
            name: s.name,
          }))}
          marketPlaces={marketPlaces}
          selectedMarketPlace={marketPlace}
          couriers={couriers}
          selectedCourier={courier}
          selectedUser={userId}
          selectedDate={date}
          selectedOutlet={outletId}
          selectedShift={shiftId}
        />
      </div>
      
      <div className="bg-white border-[1px] border-slate-200 rounded-md overflow-hidden p-6 mb-10">
          <div className="flex justify-between gap-10">
            <div className="w-1/2">
              <h2 className="text-md font-semibold">Ringkasan Berdasarkan Market Place</h2>
              <div>
                {countByMarketPlace.map((item: {name: string, value: number}) => <div key={item.name} className="flex justify-start gap-4">
                  <div className="w-[100px] p-1">{item.name}</div>
                  <div>: {item.value}</div>
                </div>)}
              </div>
              <div className="flex justify-start gap-4 font-semibold">
                <div className="w-[100px] p-1">Total</div>
                <div>: {countAll}</div>
              </div>
            </div>

            <div className="w-1/2">
              <h2 className="text-md font-semibold">Ringkasan Berdasarkan Kurir</h2>
              <div>
                {countByCourier.map((item: {name: string, value: number}) => <div key={item.name} className="flex justify-start gap-4">
                  <div className="w-[100px] p-1">{item.name}</div>
                  <div>: {item.value}</div>
                </div>)}
              </div>
              <div className="flex justify-start gap-4 font-semibold">
                <div className="w-[100px] p-1">Total</div>
                <div>: {countAll}</div>
              </div>
            </div>
          </div>
      </div>

      <div className="bg-white border-[1px] border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-top-[1px] border-slate-200 rounded-md">
                <th scope="col" className="px-6 py-5">No.</th>
                <th scope="col" className="px-6 py-5">
                  No. Transaksi
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5">
                  Waktu
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5">
                  Kasir/Shift
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5">
                  Market Place
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5">
                  Pengiriman
                </th>
                <th scope="col" className="px-6 py-5 text-center">Jumlah Item</th>
                <th scope="col" className="px-6 py-5 text-center">Total</th>
                <th scope="col" className="px-6 py-5 text-center">Detail Transaksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredList.map((tr, index) => {
              const mp = tr.cardNumber?.split('/') || []
              const cr = tr.confirmNumber?.split('/') || []

              return (
                <tr key={tr.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-3 w-10">{index + 1}</td>
                  <td className="px-6 py-3 w-[100px] text-black dark:text-white">{tr.id}</td>
                  <td className="px-6 py-3 w-[150px]">{moment(tr.transactionTime).format('DD-MM-yyyy HH:mm:ss')}</td>
                  <td className="px-6 py-3 text-center">{tr.user.name} ({tr.userShift.shift.name})</td>
                  <td className="px-6 py-3 w-80 dark:text-white">
                    <div>{mp[0]}</div>
                    <div>{mp[1]}</div>
                  </td>
                  <td className="px-6 py-3 w-80 dark:text-white">
                    <div>{cr[0]}</div>
                    <div>{cr[1]}</div>
                  </td>
                  <td className="px-6 py-3 text-center text-black">
                    {tr.totalItem}
                  </td>
                  <td className="px-6 py-3 text-right text-black">
                      {formatCurrency(Number(tr.totalPrice))}
                  </td>
                  <td className="px-6 py-3 text-right text-black">
                    <Tooltip content="Lihat Detail Transaksi" placement="bottom">
                      <TransactionDetailsModal 
                        modalTitle={`Detail Transaksi: ${tr.id}`}
                        buttonTitle={<TbListDetails />}
                        transaction={tr}
                      />
                    </Tooltip>
                  </td>
                </tr>
              )
            })}
              <tr className="bg-slate-50">
                <td colSpan={7} className="px-6 py-3 text-right">Total</td>
                <td className="px-6 py-3 text-right"><strong>{formatCurrency(totalAllFiltered)}</strong></td>
                <td></td>
              </tr>
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default StockReportPage