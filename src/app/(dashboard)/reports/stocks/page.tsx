import { Brand, Category, Outlet, Prisma } from "@prisma/client"
import queryString from "query-string";
import moment from "moment";
import StockListFilter from "./components/StocktListFilter";
import TablePagination from "../../components/TablePagination";
import { getCookieString } from "@/actions/Cookies";

type StockMovement = Prisma.StockMovementGetPayload<{
  include: { 
    productStock: {
      include: {
        product: {
          include: {
            brand: true,
            category: true
          }
        }
      }
    },
    moveType: true
  }
}>

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
  
  const resCategory = await fetch(`${process.env.URL}/api/categories`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const categories: Category[] = await resCategory.json()

  const resBrand = await fetch(`${process.env.URL}/api/brands`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const brands: Brand[] = await resBrand.json()
  const query = queryString.stringify(searchParams || {});

  const resStockMoves = await fetch(
    `${process.env.URL}/api/reports/stocks/${outletId}${query !== '' ? `?${query}` : ''}`, 
    {
      headers: requestHeaders,
      cache: 'no-cache'
    }
  )
  const paginated: [StockMovement[], number, number, number] = await resStockMoves.json()

  const [ stockMovements, totalRow, currentPage, limit] = paginated
  const totalPages = Math.floor(totalRow/limit)

  return (
    <div className="grow min-h-[500px]">
      <div>
        <h1 className="font-bold text-2xl mb-10">LAPORAN PERUBAHAN STOK HARIAN</h1>
      </div>

      <div>
        <StockListFilter 
          categories={categories} 
          brands={brands}
          outlets={outlets}
          selectedBrand={searchParams?.brandId}
          selectedCategory={searchParams?.categoryId}
          searchProduct={searchParams?.search}
          selectedDate={searchParams?.moveDate}
        />
      </div>

      <div>
        <TablePagination currentPage={currentPage} totalPages={totalPages} limit={50}/>
      </div>

      <div className="bg-white border-[1px] border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-top-[1px] border-slate-200 rounded-md">
                <th scope="col" className="px-6 py-5">No.</th>
                <th scope="col" className="px-6 py-5">Nama Produk</th>
                <th scope="col" className="px-6 py-5">Tanggal</th>
                <th scope="col" className="px-6 py-5">Stok Awal</th>
                <th scope="col" className="px-6 py-5">Jml. Pengurangan/Penambahan</th>
                <th scope="col" className="px-6 py-5">Stok Akhir</th>
                <th scope="col" className="px-6 py-5">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {stockMovements.map((sm, index) => (
              <tr key={sm.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-3 w-10">{index + 1}</td>
                <td className="px-6 py-3 w-80 text-black dark:text-white">{sm.productStock.product.name}</td>
                <td className="px-6 py-3 w-[200px]">{moment(sm.moveDate).format('YYYY-MM-D')}</td>
                <td className="px-6 py-3">{sm.startQuantity}</td>
                <td className="px-6 py-3 text-right">
                  <span className={`${sm.direction === 'IN' ? 'text-blue-500' : 'text-red-500'}`}>
                    {`${sm.direction === 'IN' ? '+' : '-'}`}
                    {sm.quantity}
                  </span>
                </td>
                <td className="px-6 py-3">{sm.endQuantity}</td>
                <td className="px-6 py-3">
                  <div>{sm.moveType.name}</div>
                  <div>{sm.description}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
          <TablePagination currentPage={currentPage} totalPages={totalPages} limit={50}/>
      </div>

    </div>
  )
}

export default StockReportPage