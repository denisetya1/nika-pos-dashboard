import { Brand, Category, Outlet, Prisma } from "@prisma/client"
import queryString from "query-string";
import StockListFilter from "../components/StocktListFilter";
import TablePagination from "../../../components/TablePagination";
import SortableHeader from "@/app/(dashboard)/components/SortableHeader";
import { getCookieString } from "@/actions/Cookies";

type ProductStock = Prisma.ProductStockGetPayload<{
  include: { 
    stockMovements: true,
    product: {
      include: {
        brand: true,
        category: true
      }
    }
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

  const resProductStock = await fetch(
    `${process.env.URL}/api/reports/stocks/${outletId}/by-products${query !== '' ? `?${query}` : ''}`, 
    {
      headers: requestHeaders,
      cache: 'no-cache'
    }
  )
  
  const paginated: [ProductStock[], number, number, number] = await resProductStock.json()

  const [ productStocks, totalRow, currentPage, limit] = paginated
  const totalPages = Math.floor(totalRow/limit)

  const calculateStock = (ps: ProductStock) => {
    if(ps.stockMovements.length === 0){
      return [ps.quantity, 0, 0, ps.quantity]
    } 

    let _start = 0;
    let _in = 0;
    let _out = 0;
    let _end = 0;

    ps.stockMovements.forEach((m, index) => {
      if(index === 0){
        _start = Number(m.startQuantity)
      }
      if(m.direction === 'IN'){
        _in += Number(m.quantity)
      } else {
        _out += Number(m.quantity)
      }
      _end = Number(m.endQuantity)
    })

    return [_start, _in, _out, _end]
  }

  return (
    <div className="min-h-[500px]">
      <div>
        <h1 className="font-bold text-2xl mb-10">LAPORAN STOK KELUAR/MASUK HARIAN</h1>
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
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-bottom-[1px] border-slate-200 rounded-md">
                <th scope="col" className="px-6 py-5">No.</th>
                <th scope="col" className="px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Nama"
                    fieldName="name"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Brand"
                    fieldName="brand"
                  />
                </th>
                <th scope="col" className="px-6 py-5 text-center">Stok Awal</th>
                <th scope="col" className="px-6 py-5 text-center">In</th>
                <th scope="col" className="px-6 py-5 text-center">Out</th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Stok Akhir"
                    fieldName="quantity"
                  />
                </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {productStocks.map((ps, index) => {
              const [startQuantity, _in, _out, endQuantity] = calculateStock(ps)

              return (
                <tr key={ps.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-3 w-10">{index + 1}</td>
                  <td className="px-6 py-3 w-80 text-black dark:text-white">{ps.product.name}</td>
                  <td className="px-6 py-3 w-80 text-black dark:text-white">{ps.product.brand.name}</td>
                  <td className="px-6 py-3 text-center">{startQuantity}</td>
                  <td className="px-6 py-3 text-center">
                    {_in}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {_out}
                  </td>
                  <td className="px-6 py-3 text-center">{endQuantity}</td>
                </tr>
              )
            })}
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