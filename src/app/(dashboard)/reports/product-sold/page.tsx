
import { Outlet, Prisma, Shift, TransactionDetail, User } from "@prisma/client"
import moment from "moment";
import OutletDateFilter from "../components/OutletDateFilter";
import { formatCurrency } from "@/app/helpers/functions";

type ProductSold = {
  _sum: { qty: number }
  productStockId: string
  barcode: string
  finalSellPrice: string
  name: string
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

  const resProductSold = await fetch(
    `${process.env.URL}/api/reports/product-sold?outletId=${outletId}&date=${date}`, 
    {
      cache: 'no-cache'
    }
  )

  const productSolds: ProductSold[] = await resProductSold.json()
  console.log(productSolds)

  return (
    <div className="block p-5 min-h-[100%] w-full sm:p-8 md:p-10 lg:p-20">
      <div>
        <OutletDateFilter 
          outlets={outlets}
          selectedDate={date}
          selectedOutlet={outletId}
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <th scope="col" className="px-6 py-3">No.</th>
            <th scope="col" className="hidden sm:table-cell px-6 py-3">
              Barcode
            </th>
            <th scope="col" className="hidden sm:table-cell px-6 py-3">
              Nama Produk
            </th>
            <th scope="col" className="hidden sm:table-cell px-6 py-3">
              Harga Jual Satuan
            </th>
            <th scope="col" className="px-6 py-3 text-center">Jumlah Terjual</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {productSolds.map((ps, index) => {
            return (
              <tr key={ps.productStockId} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-3 w-10">{index + 1}</td>
                <td className="px-6 py-3 text-black dark:text-white w-[100px]">{ps.barcode ? ps.barcode  : '-'}</td>
                <td className="px-6 py-3 w-80 text-black dark:text-white">{ps.name}</td>
                <td className="px-6 py-3 text-center">{formatCurrency(Number(ps.finalSellPrice))}</td>
                <td className="px-6 py-3 text-center">{ps._sum.qty}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

    </div>
  )
}

export default StockReportPage