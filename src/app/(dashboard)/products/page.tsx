import { Brand, Category, Prisma } from "@prisma/client"
import AddEditProductModal from "./components/AddEditProductModal";
import ProductListFilter from "./components/ProductListFilter";
import queryString from "query-string";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import AlertContextProvider from "@/app/context/alert/AlertContextProvider";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { Pagination } from "flowbite-react";
import TablePagination from "../components/TablePagination";
import SortableHeader from "../components/SortableHeader";

type Product = Prisma.ProductGetPayload<{
  include: { brand: true, category: true}
}>

const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const resCategory = await fetch(`${process.env.URL}/api/categories`, {
    cache: 'no-cache'
  })
  const categories: Category[] = await resCategory.json()

  const resBrand = await fetch(`${process.env.URL}/api/brands`, {
    cache: 'no-cache'
  })
  const brands: Brand[] = await resBrand.json()
  const query = queryString.stringify(searchParams || {});

  const resPorduct = await fetch(
    `${process.env.URL}/api/products${query !== '' ? `?${query}` : ''}`, 
    {
      cache: 'no-cache'
    }
  )

  const paginated: [Product[], number, number, number] = await resPorduct.json()

  const [ products, totalRow, currentPage, limit] = paginated
  const totalPages = Math.floor(totalRow/limit)

  return (
    <div className="p-20">
      <div>
        <h1 className="font-bold text-2xl mb-10">DAFTAR PRODUK</h1>
      </div>
      <div className="flex justify-end items-center mb-10">
        <AlertContextProvider>
          <AddEditProductModal 
            categories={categories}
            brands={brands}
            btnTitle="Tambah Produk"
            btnColor="blue"
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
                  title="SKU"
                  fieldName="sku"
                />
              </th>
              <th scope="col" className="px-6 py-3 hover:bg-gray-200">
                <SortableHeader
                  title="Barcode"
                  fieldName="barcode"
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
              <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product, index) => (
            <tr key={product.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-3 w-10">{index + 1 + ((currentPage - 1) * limit)}</td>
              <td className="px-6 py-3 w-80 text-black dark:text-white">{product.name}</td>
              <td className="px-6 py-3">{product.sku ? product.sku : '-'}</td>
              <td className="px-6 py-3">{product.barcode ? product.barcode : '-'}</td>
              <td className="px-6 py-3">{product.category.name}</td>
              <td className="px-6 py-3">{product.brand.name}</td>
              <td className="px-6 py-3">
                <div className="flex flex-row gap-3">
                  <AddEditProductModal 
                    categories={categories}
                    brands={brands}
                    product={product}
                    btnTitle={<HiOutlinePencilSquare className="text-blue-600" />}
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

      <div>
        <TablePagination currentPage={currentPage} totalPages={totalPages} limit={50}/>
      </div>

    </div>
  )
}

export default page