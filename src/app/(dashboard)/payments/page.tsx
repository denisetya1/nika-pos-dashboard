import { Outlet, Prisma } from "@prisma/client"
import OutletFilter from "./components/OutletFilter";
import TogglePayment from "./components/TogglePayment";

type PaymentType = Prisma.PaymentTypeGetPayload<{
  include: { OutletPaymentTypes: true }
}>

const PaymentPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId

  const resPayments = await fetch(`${process.env.URL}/api/outlets/${outletId}/payments`, {
    cache: 'no-cache'
  })
  const payments: PaymentType[] = await resPayments.json()


  return (
    <div className="p-5 sm:p-8 md:p-10 lg:p-20">
      <div>
        <OutletFilter outlets={outlets}/>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <th scope="col" className="px-6 py-3 w-10">No.</th>
              <th scope="col" className="px-6 py-3">Nama Pembayaran</th>
              <th scope="col" className="px-6 py-3 w-80">Active</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {payments.map((payment, index) => (
            <tr key={payment.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3 text-black dark:text-white">{payment.displayName}</td>
              <td className="px-6 py-3">
                <div className="flex gap-3">
                  <TogglePayment 
                    value={payment?.OutletPaymentTypes?.length > 0 ? payment?.OutletPaymentTypes[0]?.isActive : false}
                    paymentTypeId={payment.id}
                    outletId={Number(outletId)}
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

export default PaymentPage