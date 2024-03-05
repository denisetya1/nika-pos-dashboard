import { Outlet, Prisma } from "@prisma/client"
import OutletFilter from "../components/OutletFilter";
import ToggleActive from "../components/ToggleActive";
import AddEditShiftModal from "../components/AddEditShiftModal";
import { getCookieString } from "@/actions/Cookies";

type Shift = Prisma.ShiftGetPayload<{
  include: { outlet: true }
}>

const ShiftPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined}
}) => {
  const requestHeaders: HeadersInit = new Headers()
  requestHeaders.set('Cookie', getCookieString())
  
  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId

  const resShifts = await fetch(`${process.env.URL}/api/outlets/${outletId}/shifts`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const shifts: Shift[] = await resShifts.json()
  
  const currentOutlet = outlets.find((item) => String(item.id) === outletId)

  return (
    <div className="grow">
      <div>
        <h1 className="font-bold text-2xl mb-10">DAFTAR SHIFT</h1>
      </div>

      <div className="w-full flex justify-end mb-4">
        <AddEditShiftModal 
          buttonTitle="Tambah Shift"
          endpoint={`/api/outlets/${outletId}/shifts`}
          placeholder="Nama Shift" 
          modalTitle="Tambah Shift"
          outletName={String(currentOutlet?.name)}
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
                <th scope="col" className="px-6 py-5">Jam Kerja</th>
                <th scope="col" className="px-6 py-5 w-80">Active</th>
                <th scope="col" className="px-6 py-5 w-80">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {shifts.map((shift, index) => (
              <tr key={shift.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3 text-black dark:text-white">{shift.name}</td>
                <td className="px-6 py-3 text-black dark:text-white">{shift.workingHours}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-3">
                    <ToggleActive 
                      value={shift.isActive}
                      endpoint={`/api/outlets/${outletId}/shifts/${shift.id}`}
                    />
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-3">
                    <AddEditShiftModal 
                      data={shift}
                      buttonTitle="Edit Shift"
                      endpoint={`/api/outlets/${outletId}/shifts/${shift.id}`}
                      modalTitle="Edit Shift"
                      outletName={String(currentOutlet?.name)}
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

export default ShiftPage