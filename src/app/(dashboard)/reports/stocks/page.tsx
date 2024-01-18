import { Brand, Category, Outlet, Prisma } from "@prisma/client"
import queryString from "query-string";
import StockListFilter from "./components/StocktListFilter";
import TablePagination from "../../components/TablePagination";

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
  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId
  
  const resCategory = await fetch(`${process.env.URL}/api/categories`, {
    cache: 'no-cache'
  })
  const categories: Category[] = await resCategory.json()

  const resBrand = await fetch(`${process.env.URL}/api/brands`, {
    cache: 'no-cache'
  })
  const brands: Brand[] = await resBrand.json()
  const query = queryString.stringify(searchParams || {});

  const resStockMoves = await fetch(
    `${process.env.URL}/api/reports/stocks/${outletId}`, 
    {
      cache: 'no-cache'
    }
  )

  // const stockMovements: StockMovement[] = await resStockMoves.json()

  const paginated: [StockMovement[], number, number, number] = await resStockMoves.json()

  const [ stockMovements, totalRow, currentPage, limit] = paginated
  const totalPages = Math.floor(totalRow/limit)

  return (
    <div className="p-5 sm:p-8 md:p-10 lg:p-20">

      <div>
        <StockListFilter 
          categories={categories} 
          brands={brands}
          outlets={outlets}
          selectedBrand={searchParams?.brandId}
          selectedCategory={searchParams?.categoryId}
          searchProduct={searchParams?.search}
          pageURL='/reports/stocks'
        />
      </div>

      <div>
        <TablePagination currentPage={currentPage} totalPages={totalPages} limit={50}/>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3">No.</th>
              <th scope="col" className="px-6 py-3">Nama Produk</th>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Stok Awal</th>
              <th scope="col" className="px-6 py-3">Jml. Pengurangan/Penambahan</th>
              <th scope="col" className="px-6 py-3">Stok Akhir</th>
              <th scope="col" className="px-6 py-3">Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {stockMovements.map((sm, index) => (
            <tr key={sm.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-3 w-10">{index + 1}</td>
              <td className="px-6 py-3 w-80 text-black dark:text-white">{sm.productStock.product.name}</td>
              <td className="px-6 py-3">{`${new Date(sm.moveDate).getDate()}-${new Date(sm.moveDate).getMonth() + 1}-${new Date(sm.moveDate).getFullYear()}`}</td>
              <td className="px-6 py-3">{0}</td>
              <td className="px-6 py-3 text-right">
                <span className={`${sm.direction === 'IN' ? 'text-blue-500' : 'text-red-500'}`}>
                  {`${sm.direction === 'IN' ? '+' : '-'}`}
                  {sm.quantity}
                </span>
              </td>
              <td className="px-6 py-3">{0}</td>
              <td className="px-6 py-3">
                <div>{sm.moveType.name}</div>
                <div>{sm.description}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <TablePagination currentPage={currentPage} totalPages={totalPages} limit={50}/>
      </div>

    </div>
  )
}

export default StockReportPage