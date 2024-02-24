import { formatCurrency } from "@/app/helpers/functions";
import { Outlet, Prisma, Shift, User } from "@prisma/client"
import moment from "moment";
import SalesFilter from "../components/SalesFilter";
import { Tooltip } from "flowbite-react";
import { TbListDetails } from "react-icons/tb";
import TransactionDetailsModal from "../components/TransactionDetailsModal";

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
  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId
  
  const date = searchParams?.date || moment().format('YYYY-MM-DD')
  const userId = searchParams?.userId;
  const paymentId = searchParams?.paymentId;
  const shiftId = searchParams?.shiftId;

  const resSales = await fetch(
    `${process.env.URL}/api/reports/sales?outletId=${outletId}&date=${date}`, 
    {
      cache: 'no-cache'
    }
  )

  const transactions: Transaction[] = await resSales.json()

  const getFilterAndTotal = (data: Transaction[]) => {
    const totalByPayment: TotalByPayment = {}
    let totalAll = 0
    const shifts: Shift[] = []
    const users: User[] = []
    const payments: String[] = []

    data.map((tr) => {
      totalAll += Number(tr.totalPrice)

      if(!shifts.find((s) => s.id === tr.userShift.shift.id)){
        shifts.push(tr.userShift.shift)
      }
      if(!users.find((u) => u.id === tr.user.id)){
        users.push(tr.user)
      }

      if(totalByPayment[tr.outletPaymentMethod.paymentMethod.name]){
        totalByPayment[tr.outletPaymentMethod.paymentMethod.name] = totalByPayment[tr.outletPaymentMethod.paymentMethod.name] + Number(tr.totalPrice)
      } else {
        payments.push(tr.outletPaymentMethod.paymentMethod.name)
        totalByPayment[tr.outletPaymentMethod.paymentMethod.name] = Number(tr.totalPrice)
      }
    })

    return {
      totalAll,
      totalByPayment,
      shifts,
      users,
      payments
    }
  }

  const {
    shifts,
    users,
    payments
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

      if(paymentId && tx.outletPaymentMethod.paymentMethod.name !== paymentId) {
        filterUser = false
      }

      return filterUser && filterShift && filterPayment

    })
  
  const {
    totalAll: totalAllFiltered,
    totalByPayment: totalByPaymentFiltered
  } = getFilterAndTotal(filteredList)

  return (
    <div className="min-h-[500px] p-5 sm:p-8 md:p-10 lg:p-20">

      <div>
        <SalesFilter 
          outlets={outlets}
          users={users.map((u) => ({
            id: u.id,
            name: u.name,
          }))}
          shifts={shifts.map((s) => ({
            id: Number(s.id),
            name: s.name,
          }))}
          payments={payments.map((p) => ({
            id: p as string,
            name: p as string,
          }))}
          selectedPayment={paymentId}
          selectedUser={userId}
          selectedDate={date}
          selectedOutlet={outletId}
          selectedShift={shiftId}
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3">No.</th>
              <th scope="col" className="px-6 py-3">
                No. Transaksi
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3">
                Waktu
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3">
                Kasir
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3">
                Shift
              </th>
              <th scope="col" className="px-6 py-3 text-center">Jumlah Item</th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3">
               Metode Pembayaran
              </th>
              <th scope="col" className="px-6 py-3 text-center">Total</th>
              <th scope="col" className="px-6 py-3 text-center">Detail Transaksi</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredList.map((tr, index) => {
            return (
              <tr key={tr.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-3 w-10">{index + 1}</td>
                <td className="px-6 py-3 w-[100px] text-black dark:text-white">{tr.id}</td>
                <td className="px-6 py-3 w-[150px]">{moment(tr.transactionTime).format('DD-MM-yyyy HH:mm:ss')}</td>
                <td className="px-6 py-3 text-center">{tr.user.name}</td>
                <td className="px-6 py-3 w-80 dark:text-white">{tr.userShift.shift.name}</td>
                <td className="px-6 py-3 text-center text-black">
                  {tr.totalItem}
                </td>
                <td className="px-6 py-3 text-center">{tr.outletPaymentMethod.paymentMethod.displayName}</td>
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
            {payments.map((p) => (<tr key={p as string} className="bg-slate-100">
                <td colSpan={7} className="px-6 py-3 text-right">Total {p}</td>
                <td className="px-6 py-3 text-right"><strong>{formatCurrency(totalByPaymentFiltered[p as string])}</strong></td>
                <td></td>
            </tr>))}
            <tr className="bg-slate-100">
              <td colSpan={7} className="px-6 py-3 text-right">Total</td>
              <td className="px-6 py-3 text-right"><strong>{formatCurrency(totalAllFiltered)}</strong></td>
              <td></td>
            </tr>
        </tbody>
      </table>

    </div>
  )
}

export default StockReportPage