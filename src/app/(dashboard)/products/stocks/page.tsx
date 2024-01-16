import { Brand, Category, MoveType, Outlet, Prisma } from "@prisma/client"
import queryString from "query-string"
import ProductListFilter from "../components/ProductListFilter"
import StockMovementForm from "../components/StockMovementForm"
import { formatCurrency } from "@/app/helpers/functions"
import { TextInput } from "flowbite-react"
import EditPriceForm from "../components/EditPriceForm"
import SortableHeader from "../../components/SortableHeader"
import TablePagination from "../../components/TablePagination"

type Product = Prisma.ProductGetPayload<{
  include: { brand: true, category: true, stocks: true}
}>

const ProductStock = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const resCategory = await fetch(`${process.env.URL}/api/categories`, {
    cache: 'no-cache'
  })
  const categories: Category[] = await resCategory.json()

  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId
    
  searchParams = {
    outletId: outlets[0].id.toString(),
    ...searchParams
  }

  const resBrand = await fetch(`${process.env.URL}/api/brands`, {
    cache: 'no-cache'
  })
  const brands: Brand[] = await resBrand.json()

  const resMove = await fetch(`${process.env.URL}/api/movements`)
  const movements: MoveType[] = await resMove.json()

  const query = queryString.stringify(searchParams || {}, {
    skipEmptyString: true,
    skipNull: true
  });


  const resProduct = await fetch(
    `${process.env.URL}/api/products/stocks${query !== '' ? `?${query}` : ''}`, 
    {
      cache: 'no-cache'
    }
  )

  // const products: Product[] = await resProduct.json()

  const paginated: [Product[], number, number, number] = await resProduct.json()

  const [ products, totalRow, currentPage, limit] = paginated
  const totalPages = Math.floor(totalRow/limit)

  return (
    <div className="p-20">
      <div>
        <h1 className="font-bold text-2xl mb-10">DAFTAR STOK &amp; HARGA</h1>
      </div>

      <div>
        <ProductListFilter 
          categories={categories} 
          brands={brands}
          outlets={outlets}
          selectedOutlet={searchParams?.outletId}
          selectedBrand={searchParams?.brandId}
          selectedCategory={searchParams?.categoryId}
          searchProduct={searchParams?.search}
          pageURL="/products/stocks"
        />
      </div>

      <div>
        <TablePagination currentPage={currentPage} totalPages={totalPages} limit={50}/>
      </div>
      
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3">No.</th>
              <th scope="col" className="px-6 py-3 hover:bg-gray-200">
                <SortableHeader
                  title="Nama"
                  fieldName="name"
                />
              </th>
              <th scope="col" className="px-6 py-3 hover:bg-gray-200">
                <SortableHeader
                  title="Kategori"
                  fieldName="category"
                />
              </th>
              <th scope="col" className="px-6 py-3 hover:bg-gray-200">
                <SortableHeader
                  title="Brand"
                  fieldName="brand"
                />
              </th>
              <th scope="col" className="px-6 py-3">
                Harga
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product, index) => (
            <tr key={product.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-3 w-10">{index + 1}</td>
              <td className="px-6 py-3 w-80 text-black dark:text-white">
                <div>{product.name}</div>
                <div className="flex justify-start items-center gap-4 text-gray-500 text-xs">
                  <div>sku: {product.sku === '' || product.sku === null ? '-' : product.sku}</div>
                  <div>barcode: {product.barcode === '' || product.barcode === null ? '-' : product.barcode}</div>
                </div>
                <div className="text-gray-500 text-xs">
                  shopee:<br />
                  {product.linkShopee !== null ? <a target="_blank" className="hover:text-blue-600" href={product.linkShopee}>{product.linkShopee.substring(0,100)}...</a> : "-" }
                </div>
              </td>
              <td className="px-6 py-3">{product.category.name}</td>
              <td className="px-6 py-3">{product.brand.name}</td>
              <td className="px-6 py-3">
                <div className="flex justify-end align-middle gap-2">
                  <div className="py-2">
                    { product.stocks.length > 0 ? formatCurrency(Number(product.stocks[0]?.sellPrice)) : "-"} 
                  </div>
                  <div className="py-2">
                    <EditPriceForm 
                      product={product}
                      outlet={outlets.filter((o) => (o.id.toString() === outletId))[0]}
                      sellPrice={Number(product.stocks[0]?.sellPrice)}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-3 text-center">
                  <div className="flex justify-center items-center">
                    <div className="border-[1px] border-gray-200 rounded-l-lg overflow-hidden">
                      <StockMovementForm 
                        direction="OUT"
                        product={product}
                        outlet={outlets.filter((o) => o.id.toString() === outletId)[0]}
                        currentQuantity={product.stocks[0]?.quantity}
                        movements={movements}
                        productStock={product.stocks[0]}
                        disabled={product.stocks[0]?.quantity === undefined || product.stocks[0]?.quantity === 0 }
                      />
                    </div>
                    <div className="px-2 py-2 w-[60px] border-[1px] border-gray-200 text-center">
                      { product.stocks.length > 0 ? `${product.stocks[0]?.quantity}` : '0' }
                    </div>
                    <div className="border-[1px] border-gray-200 rounded-r-lg overflow-hidden">
                      <StockMovementForm 
                        direction="IN"
                        product={product}
                        outlet={outlets.filter((o) => (o.id.toString() === outletId))[0]}
                        currentQuantity={product.stocks[0]?.quantity}
                        movements={movements}
                        productStock={product.stocks[0]}
                      />
                    </div>
                  </div>
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

export default ProductStock