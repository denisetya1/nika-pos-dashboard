'use client'

import { useQuery } from "@tanstack/react-query"
import { TextInput } from "flowbite-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const page = () => {
  const [search, setSearch] = useState('') 
  const session = useSession();

  const {data: products, isLoading: isLoadingProduct, isError: isErrorProduct} = useQuery({
    queryKey: ['search-product', search],
    queryFn: () => (`/api/pos/${session.data?.user.outletId}/products?search=${search}`)
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(()=>{

  }, [search, isLoadingProduct, products])

  return (
    <div>
      <div>
        <h1 className="font-bold text-2xl mb-10">INPUT PENJUALAN ONLINE</h1>
      </div>

      <div className="flex justify-end items-center mb-10">
          <TextInput name="search" onChange={handleSearchChange} value={search}/>
      </div>

      <div className="border-[1px] border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-md overflow-hidden">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-top-[1px] border-slate-200 rounded-md">
                <th scope="col" className="px-6 py-5">No.</th>
                <th scope="col" className="px-6 py-5 hover:bg-gray-200">
                  Nama Produk
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-5 hover:bg-gray-200">
                  Barcode
                </th>
                <th scope="col" className="px-6 py-5">Jumlah</th>
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

    </div>
  )
}

export default page