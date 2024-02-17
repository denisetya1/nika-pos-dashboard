import { Role } from "@prisma/client"
import AddEditRoleModal from "../components/AddEditRoleModal";
import queryString from "query-string";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const Roles = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const query = queryString.stringify(searchParams || {});

  const res = await fetch(
    `${process.env.URL}/api/roles${query !== '' ? `?${query}` : ''}`, 
    {
      cache: 'no-cache'
    }
  )

  const roles: Role[] = await res.json()

  return (
    <div className="p-20">
      <div className="flex justify-end items-center mb-10">
        <AddEditRoleModal 
          buttonTitle="Tambah Role"
          modalTitle="Tambah Role"
          endpoint="/api/roles"
          label="Nama Role"
          placeholder="Nama Role"
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3 w-10">No.</th>
              <th scope="col" className="px-6 py-3">Nama Role</th>
              <th scope="col" className="px-6 py-3 w-80">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {roles.map((role, index) => (
            <tr key={role.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3 text-black dark:text-white">{role.name}</td>
              <td className="px-6 py-3">
                <div className="flex gap-3">
                  <AddEditRoleModal 
                    buttonTitle="Edit"
                    modalTitle="Edit Role"
                    endpoint={`/api/roles/${role.id}`}
                    data={role}
                    disabled={role.storeId === null ? true : false}
                  />
                  <ConfirmDeleteModal 
                    modalTitle="Hapus Role"
                    buttonTitle="Hapus"
                    data={role}
                    endpoint={`/api/roles/${role.id}`}
                    disabled={role.storeId === null ? true : false}
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

export default Roles