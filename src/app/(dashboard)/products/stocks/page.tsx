import { Brand, Category, MoveType, Outlet, Prisma } from "@prisma/client"
import queryString from "query-string"
import ProductListFilter from "../components/ProductListFilter"
import StockMovementForm from "../components/StockMovementForm"
import { formatCurrency, getFinalPrice, isEmptyVal } from "@/lib/functions"
import EditPriceForm from "../components/EditPriceForm"
import SortableHeader from "../../components/SortableHeader"
import TablePagination from "../../components/TablePagination"
import { RiBarcodeBoxLine } from "react-icons/ri"
import { getCookieString } from "@/actions/Cookies"

type Product = Prisma.ProductGetPayload<{
  include: { brand: true, category: true, stocks: true}
}>

const ProductStock = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const requestHeaders: HeadersInit = new Headers()
  requestHeaders.set('Cookie', getCookieString())
  
  const resCategory = await fetch(`${process.env.URL}/api/categories`, {
    headers: requestHeaders,
  })
  const categories: Category[] = await resCategory.json()

  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    headers: requestHeaders,
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId
    
  searchParams = {
    outletId: outlets[0].id.toString(),
    ...searchParams
  }

  const resBrand = await fetch(`${process.env.URL}/api/brands`, {
    headers: requestHeaders,
  })
  const brands: Brand[] = await resBrand.json()

  const resMove = await fetch(`${process.env.URL}/api/movements`,{
    headers: requestHeaders,
  })
  const movements: MoveType[] = await resMove.json()

  const query = queryString.stringify(searchParams || {}, {
    skipEmptyString: true,
    skipNull: true
  });
  
  const resProduct = await fetch(
    `${process.env.URL}/api/products/stocks${query !== '' ? `?${query}` : ''}`, 
    {
      headers: requestHeaders,
      cache: 'no-cache'
    }
  )

  const paginated: [Product[], number, number, number] = await resProduct.json()

  const displayLimit = 50
  const [ products, totalRow, currentPage ] = paginated
  const totalPages = Math.ceil(totalRow/displayLimit)

  return (
    <div className="grow">
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
        <TablePagination currentPage={currentPage} totalPages={totalPages} limit={displayLimit}/>
      </div>
      
      <div className="border-[1px] border-slate-200 rounded-md">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-md overflow-hidden">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-top-[1px] border-slate-200 rounded-md">
                <th scope="col" className="w-[40px] px-6 py-5">No.</th>
                <th scope="col" className="px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Nama"
                    fieldName="name"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Kategori"
                    fieldName="category"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Brand"
                    fieldName="brand"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Harga"
                    fieldName="sellPrice"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Mark Up"
                    fieldName="markupPercentage"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Diskon"
                    fieldName="discountPercentage"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  Harga Final
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Stock"
                    fieldName="quantity"
                  />
                </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product, index) => (
              <tr key={product.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-3 w-10 align-top">{index + 1}</td>
                <td className="px-6 py-3 w-80 text-black dark:text-white">
                  <div>{product.name}</div>
                  <div className="flex justify-start items-center gap-4 text-gray-500 text-xs align-top">
                    {/* <div>sku: {product.sku === '' || product.sku === null ? '-' : product.sku}</div> */}
                    <div className="flex text-gray-500 justify-start items-center gap-1"><RiBarcodeBoxLine className="text-gray-400" /> {product.barcode === '' || product.barcode === null ? '-' : product.barcode}</div>
                  </div>
                  {/* <div className="text-gray-500 text-xs">
                    shopee:<br />
                    {product.linkShopee !== null ? <a target="_blank" className="hover:text-blue-600" href={product.linkShopee}>{product.linkShopee.substring(0,100)}...</a> : "-" }
                  </div> */}
                </td>
                <td className="hidden sm:table-cell px-6 py-3 align-top">{product.category.name}</td>
                <td className="hidden sm:table-cell px-6 py-3 align-top">{product.brand.name}</td>
                <td className="px-6 py-3 align-top">
                  <div className="flex justify-end items-start align-top gap-2">
                    <div className="">
                      { product.stocks.length > 0 ? formatCurrency(Number(product.stocks[0]?.sellPrice)) : "-"} 
                    </div>
                    <div className="">
                      <EditPriceForm 
                        product={product}
                        outlet={outlets.filter((o) => (o.id.toString() === outletId))[0]}
                        sellPrice={Number(product.stocks[0]?.sellPrice)}
                        discountPercentage={product.stocks.length > 0 ? product.stocks[0].discountPercentage : 0}
                        markupPercentage={product.stocks.length > 0 ? product.stocks[0].markupPercentage : 0 }
                      />
                    </div>
                  </div>
                </td>

                <td className="hidden sm:table-cell px-6 py-3 align-top">{product.stocks.length > 0 && `${product.stocks[0]?.markupPercentage}%`}</td>
                <td className="hidden sm:table-cell px-6 py-3 align-top">{product.stocks.length > 0 && `${product.stocks[0]?.discountPercentage}%`}</td>
                <td className="hidden sm:table-cell px-6 py-3 align-top">
                {
                  product.stocks.length > 0 && !isEmptyVal(product.stocks[0].markupPercentage, true) && !isEmptyVal(product.stocks[0]?.markupPercentage, true) &&
                  <div className="text-xs line-through">
                    {product.stocks.length > 0 && getFinalPrice(Number(product.stocks[0]?.sellPrice), product.stocks[0].markupPercentage, 0, false, true)}
                  </div>
                }
                  <div>
                    {product.stocks.length > 0 && getFinalPrice(Number(product.stocks[0]?.sellPrice), product.stocks[0].markupPercentage, product.stocks[0].discountPercentage, true, true)}
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
      </div>

      <div>
        <TablePagination currentPage={currentPage} totalPages={totalPages} limit={displayLimit}/>
      </div>

    </div>
  )
}

export default ProductStock