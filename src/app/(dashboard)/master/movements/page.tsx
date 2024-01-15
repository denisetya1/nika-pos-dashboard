import { MoveType } from "@prisma/client"
import AddEditMasterDataModal from "../components/AddEditMasterDataModal";
import queryString from "query-string";
import NameFilter from "../components/NameFilter";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const query = queryString.stringify(searchParams || {});

  const res = await fetch(
    `${process.env.URL}/api/movements${query !== '' ? `?${query}` : ''}`, 
    {
      cache: 'no-cache'
    }
  )

  const movements: MoveType[] = await res.json()

  return (
    <div className="p-20">
      <div className="flex justify-end items-center mb-10">
        <AddEditMasterDataModal 
          buttonTitle="Tambah Jenis Perpindahan Stok"
          modalTitle="Tambah Jenis Perpindahan Stok"
          endpoint="/api/movements"
          labelDirection="Arah Perpindahan"
          label="Jenis Perpindahan"
          placeholder="Jenis Perpindahan"
          withDirection={true}
        />
      </div>

      <div>
        <NameFilter 
          searchName={searchParams?.search}
          pageURL='/master/movements'
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3 w-10">No.</th>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Tipe</th>
              <th scope="col" className="px-6 py-3 w-80">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {movements.map((moveType, index) => (
            <tr key={moveType.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3 text-black dark:text-white">{moveType.name}</td>
              <td className="px-6 py-3 text-black dark:text-white">{moveType.direction === 'IN' ? 'Masuk' : 'Keluar'}</td>
              <td className="px-6 py-3">
                <div className="flex gap-3">
                  <AddEditMasterDataModal 
                    buttonTitle="Edit"
                    modalTitle="Edit Jenis Perpindahan Stok"
                    labelDirection="Arah Perpindahan"
                    label="Jenis Perpindahan"
                    endpoint={`/api/movements/${moveType.id}`}
                    data={moveType}
                    disabled={moveType.storeId === null ? true : false}
                  />
                  <ConfirmDeleteModal 
                    modalTitle="Hapus Jenis Perpindahan Stok"
                    buttonTitle="Hapus"
                    data={moveType}
                    endpoint={`/api/movements/${moveType.id}`}
                    disabled={moveType.storeId === null ? true : false}
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