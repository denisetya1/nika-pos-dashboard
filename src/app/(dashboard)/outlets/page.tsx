import { Outlet } from "@prisma/client"
import queryString from "query-string";
import AddEditMasterDataModal from "./components/AddEditMasterDataModal";
import NameFilter from "./components/NameFilter";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import POSToggle from "./components/POSToggle";

const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const query = queryString.stringify(searchParams || {});

  const res = await fetch(
    `${process.env.URL}/api/outlets${query !== '' ? `?${query}` : ''}`, 
    {
      cache: 'no-cache'
    }
  )

  const outlets: Outlet[] = await res.json()

  return (
    <div className="p-20">
      <div className="flex justify-end items-center mb-10">
        <AddEditMasterDataModal 
          buttonTitle="Tambah Outlet"
          modalTitle="Tambah Outlet"
          endpoint="/api/outlets"
          label="Nama Outlet"
          placeholder="Nama Outlet"
        />
      </div>

      <div>
        <NameFilter 
          searchName={searchParams?.search}
          pageURL='/outlets'
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3 w-10">No.</th>
              <th scope="col" className="px-6 py-3">Nama</th>
              {/* <th scope="col" className="px-6 py-3 w-80">POS Active</th> */}
              <th scope="col" className="px-6 py-3 w-80">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {outlets.map((outlet, index) => (
            <tr key={outlet.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3 text-black dark:text-white">{outlet.name}</td>
              {/* <td className="px-6 py-3 text-black dark:text-white">
                <POSToggle 
                  outletId={Number(outlet.id)}
                  value={outlet.isActivePOS}
                />
              </td> */}
              <td className="px-6 py-3">
                <div className="flex gap-3">
                  <AddEditMasterDataModal 
                    buttonTitle="Edit"
                    modalTitle="Edit Outlet"
                    endpoint={`/api/outlets/${outlet.id}`}
                    data={outlet}
                    disabled={outlet.storeId === null ? true : false}
                  />
                  <ConfirmDeleteModal 
                    modalTitle="Hapus Outlet"
                    buttonTitle="Hapus"
                    data={outlet}
                    endpoint={`/api/outlets/${outlet.id}`}
                    disabled={outlet.storeId === null ? true : false}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default page