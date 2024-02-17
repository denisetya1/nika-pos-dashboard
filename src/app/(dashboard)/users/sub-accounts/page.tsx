import { User } from "@prisma/client"
import AddEditUserModal from "./components/AddEditUserModal";
import queryString from "query-string";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import moment from "moment";
import { getStore } from "@/actions/Store";

const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const query = queryString.stringify(searchParams || {});

  const res = await fetch(
    `${process.env.URL}/api/users${query !== '' ? `?${query}` : ''}`, 
    {
      cache: 'no-cache'
    }
  )
  
  const [users] = await res.json()

  const store = await getStore(1)

  return (
    <div className="p-20">
      <div className="flex justify-end items-center mb-10">
        <AddEditUserModal 
          buttonTitle="Tambah Pengguna"
          modalTitle="Tambah Pengguna"
          storeSlugName={store?.slug || ''}
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3 w-10">No.</th>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Login Trakhir</th>
              <th scope="col" className="px-6 py-3 w-80">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user: User, index: number) => (
            <tr key={user.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3 text-black dark:text-white">{user.name}</td>
              <td className="px-6 py-3 text-black dark:text-white">{user.username}</td>
              <td className="px-6 py-3 text-black dark:text-white">{user.lastLogin ? moment(user.lastLogin).format("DD-MM-YYYY HH:i:s") : ''}</td>
              <td className="px-6 py-3">
                <div className="flex gap-3">
                  <AddEditUserModal 
                    buttonTitle="Edit"
                    modalTitle="Edit User"
                    data={user}
                    storeSlugName={store?.slug || ''}
                  />
                  <ConfirmDeleteModal 
                    modalTitle="Hapus Brand"
                    buttonTitle="Hapus"
                    data={user}
                    endpoint={`/api/users/${user.id}`}
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