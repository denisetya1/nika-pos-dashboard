import { Brand, Category, Prisma } from "@prisma/client"
import AddEditProductModal from "./components/AddEditProductModal";
import ProductListFilter from "./components/ProductListFilter";
import queryString from "query-string";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import AlertContextProvider from "@/context/alert/AlertContextProvider";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { IoPricetagOutline } from "react-icons/io5";
import TablePagination from "../components/TablePagination";
import SortableHeader from "../components/SortableHeader";
import { Tooltip } from "flowbite-react";
import { getCookieString } from "@/actions/Cookies";

type Product = Prisma.ProductGetPayload<{
  include: { brand: true, category: true}
}>

const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const requestHeaders: HeadersInit = new Headers()
  requestHeaders.set('Cookie', getCookieString())
  
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

  const resPorduct = await fetch(
    `${process.env.URL}/api/products${query !== '' ? `?${query}` : ''}`, 
    {
      headers: requestHeaders,
      cache: 'no-cache'
    }
  )

  const paginated: [Product[], number, number, number] = await resPorduct.json()

  const displayLimit = 50
  const [ products, totalRow, currentPage, limit] = paginated
  const totalPages = Math.ceil(totalRow/limit)

  return (
    <div className="grow">
      <div>
        <h1 className="font-bold text-2xl mb-10">DAFTAR PRODUK</h1>
      </div>

      <div className="flex justify-end items-center mb-10">
        <AlertContextProvider>
          <AddEditProductModal 
            categories={categories}
            brands={brands}
            btnTitle="Tambah Produk"
            btnColor="purple"
            endpoint="/api/products"
          />
        </AlertContextProvider>
      </div>

      <div>
        <ProductListFilter 
          categories={categories} 
          brands={brands}
          selectedBrand={searchParams?.brandId}
          selectedCategory={searchParams?.categoryId}
          searchProduct={searchParams?.search}
          pageURL='/products'
        />
      </div>

      <div>
        <TablePagination currentPage={currentPage} totalPages={totalPages} limit={displayLimit}/>
      </div>

      <div className="border-[1px] border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-md overflow-hidden">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-top-[1px] border-slate-200 rounded-md">
                <th scope="col" className="px-6 py-5">No.</th>
                <th scope="col" className="px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Nama"
                    fieldName="name"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="SKU"
                    fieldName="sku"
                  />
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  <SortableHeader
                    title="Barcode"
                    fieldName="barcode"
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
                <th scope="col" className="px-6 py-5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product, index) => (
              <tr key={product.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-5 w-10">{index + 1 + ((currentPage - 1) * limit)}</td>
                <td className="px-6 py-5 w-80 text-black dark:text-white">
                  <div>
                    {product.name}
                  </div>
                  {product.priceTagLabel !== null && product.priceTagLabel !== '' && <div className="flex justify-start gap-1 text-xm text-gray-400">
                    <Tooltip content="Nama di label harga" style="light" placement="bottom">
                      <IoPricetagOutline />
                    </Tooltip>
                    {product.priceTagLabel}
                  </div>}
                  <div className="sm:hidden text-xs text-gray-400 flex justify-start gap-3">
                    <div>SKU: {product.sku ? product.sku : '-'}</div>
                    <div>Barcode: {product.barcode ? product.barcode : '-'}</div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-3">{product.sku ? product.sku : '-'}</td>
                <td className="hidden sm:table-cell px-6 py-3">{product.barcode ? product.barcode : '-'}</td>
                <td className="hidden sm:table-cell px-6 py-3">{product.category.name}</td>
                <td className="hidden sm:table-cell px-6 py-3">{product.brand.name}</td>
                <td className="px-6 py-3">
                  <div className="flex flex-row gap-3">
                    <AddEditProductModal 
                      categories={categories}
                      brands={brands}
                      product={product}
                      btnTitle={<HiOutlinePencilSquare className="text-primary-600" />}
                      tooltipText="Edit Produk"
                      btnColor="light"
                      endpoint={`/api/products/${product.id}`}
                    />
                    <ConfirmDeleteModal 
                      modalTitle="Hapus Jenis Perpindahan Stok"
                      buttonTitle={<HiOutlineTrash className="text-red-600"/>}
                      tooltipText="Hapus Produk"
                      deletedName={product.name}
                      btnColor="light"
                      endpoint={`/api/products/${product.id}`}
                    />
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

export default page