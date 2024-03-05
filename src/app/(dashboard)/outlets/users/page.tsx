import { Outlet, Prisma } from "@prisma/client"
import ToggleActive from "../components/ToggleActive";
import AddUserOutletModal from "./components/AddUserOutletModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import OutletFilter from "../components/OutletFilter";
import { getCookieString } from "@/actions/Cookies";

type UserOutlet = Prisma.UserOutletGetPayload<{
  include: { user: true }
}>

const OutletUserPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const requestHeaders: HeadersInit = new Headers()
  requestHeaders.set('Cookie', getCookieString())

  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId

  const resUserOutlets = await fetch(`${process.env.URL}/api/outlets/${outletId}/users`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const userOutlets: UserOutlet[] = await resUserOutlets.json()
  
  const userOutletsId = userOutlets.map((item) => item.user.id)

  return (
    <div className="grow">
      <div>
        <h1 className="font-bold text-2xl mb-10">DAFTAR PENGGUNA OUTLET</h1>
      </div>

      <div className="w-full flex justify-end mb-4">
        <AddUserOutletModal 
          addedListId={userOutletsId}
          outletId={Number(outletId)}
        />
      </div>

      <div>
        <OutletFilter outlets={outlets}/>
      </div>

      <div className="border-[1px] border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-[1px] border-slate-200">
                <th scope="col" className="px-6 py-5 w-10">No.</th>
                <th scope="col" className="px-6 py-5">Nama</th>
                <th scope="col" className="px-6 py-5">Username</th>
                <th scope="col" className="px-6 py-5 w-80">Active</th>
                <th scope="col" className="px-6 py-5 w-80">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {userOutlets.map((userOutlet, index) => (
              <tr key={userOutlet.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3 text-black dark:text-white">{userOutlet.user.name}</td>
                <td className="px-6 py-3 text-black dark:text-white">{userOutlet.user.username}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-3">
                    <ToggleActive 
                      value={userOutlet.isActive}
                      endpoint={`/api/outlets/${outletId}/users/${userOutlet.id}`}
                    />
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-3">
                    <ConfirmDeleteModal 
                      data={userOutlet.user}
                      endpoint={`/api/outlets/${outletId}/users/${userOutlet.id}`}
                      buttonTitle="Hapus"
                      modalTitle="Delete User"
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

export default OutletUserPage