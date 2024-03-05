import { Outlet, Prisma } from "@prisma/client"
import OutletFilter from "../components/OutletFilter";
import TogglePayment from "../components/TogglePayment";
import { getCookieString } from "@/actions/Cookies";

type PaymentMethod = Prisma.PaymentMethodGetPayload<{
  include: { OutletPaymentMethods: true }
}>

const PaymentMethodPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined};
}) => {
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Cookie', getCookieString())
  
  const resOutlet = await fetch(`${process.env.URL}/api/outlets`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const outlets: Outlet[] = await resOutlet.json()
  const outletId = searchParams?.outletId === undefined ? outlets[0].id.toString() : searchParams?.outletId

  const resPayments = await fetch(`${process.env.URL}/api/outlets/${outletId}/payment-methods`, {
    headers: requestHeaders,
    cache: 'no-cache'
  })
  const paymentMathods: PaymentMethod[] = await resPayments.json()


  return (
    <div className="grow">
      <div>
        <h1 className="font-bold text-2xl mb-10">DAFTAR METODE PEMBAYARAN</h1>
      </div>

      <div>
        <OutletFilter outlets={outlets}/>
      </div>

      <div className="border-[1px] border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead>
            <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-[1px] border-slate-200">
                <th scope="col" className="px-6 py-5 w-10">No.</th>
                <th scope="col" className="px-6 py-5">Nama Pembayaran</th>
                <th scope="col" className="px-6 py-5 w-80">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paymentMathods.map((payment, index) => (
              <tr key={payment.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3 text-black dark:text-white">{payment.displayName}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-3">
                    <TogglePayment 
                      value={payment?.OutletPaymentMethods?.length > 0 ? payment?.OutletPaymentMethods[0]?.isActive : false}
                      paymentMethodId={payment.id}
                      outletId={Number(outletId)}
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

export default PaymentMethodPage