
import { Outlet } from "@prisma/client"
import moment from "moment";
import { formatCurrency } from "@/lib/functions";
import { getCookieString } from "@/actions/Cookies";
import queryString from "query-string";
import OutletDateRangeFilter from "../../components/OutletDateRangeFilter";

type ProductSold = {
  _sum: { qty: number }
  productStockId: string
  barcode: string
  finalSellPrice: string
  name: string
}

const StockReportPage = async ({
  searchParams,
  params
}: {
  searchParams?: { [key: string]: string | undefined }
  params: {
    productId: string
  }
}) => {
  const requestHeaders: HeadersInit = new Headers()
  requestHeaders.set('Cookie', getCookieString())

  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId

  const startDate = searchParams?.startDate || moment().format('YYYY-MM-DD')
  const endDate = searchParams?.endDate || moment().format('YYYY-MM-DD')
  const search = searchParams?.search

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

  const resProductSold = await fetch(
    `${process.env.URL}/api/reports/product-sold?${qs}`,
    {
      headers: requestHeaders,
      cache: 'no-cache'
    }
  )

  const productSolds: ProductSold[] = await resProductSold.json()

  return (
    <div className="grow min-h-[500px]">
      <div>
        <h1 className="font-bold text-2xl mb-10">LAPORAN BARANG TERJUAL HARIAN</h1>
      </div>

      <div>
        <OutletDateRangeFilter
          outlets={outlets}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
          selectedOutlet={outletId}
          searched={search}
        />
      </div>

      <div className="bg-white border-[1px] border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-[1px] border-slate-200">
              <th scope="col" className="px-6 py-5">No.</th>
              <th scope="col" className="hidden sm:table-cell px-6 py-5">
                Barcode
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-5">
                Nama Produk
              </th>
              <th scope="col" className="hidden sm:table-cell px-6 py-5">
                Harga Jual Satuan
              </th>
              <th scope="col" className="px-6 py-5 text-center">Jumlah Terjual</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {productSolds.map((ps, index) => {
              return (
                <tr key={ps.productStockId} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-3 w-10">{index + 1}</td>
                  <td className="px-6 py-3 text-black dark:text-white w-[100px]">{ps.barcode ? ps.barcode : '-'}</td>
                  <td className="px-6 py-3 w-80 text-black dark:text-white">{ps.name}</td>
                  <td className="px-6 py-3 text-center">{formatCurrency(Number(ps.finalSellPrice))}</td>
                  <td className="px-6 py-3 text-center">{ps._sum.qty}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default StockReportPage