'use client'

import { ToggleSwitch } from "flowbite-react"
import { useRouter } from "next/navigation"
import AlertMsg from "../../components/AlertMsg";
import { useAlertContext } from "@/context/alert/AlertContext";

const TogglePayment = ({
  value,
  outletId,
  paymentMethodId
}: {
  value: boolean,
  outletId: number
  paymentMethodId: number
}) => {

  const router = useRouter()
  const { setAlert } = useAlertContext()

  const setSwitch = async (switchValue : boolean) => {

    const res = await fetch(`/api/outlets/${outletId}/payment-methods/upsert`, {
      method: 'POST',
      body: JSON.stringify({
        outletId: Number(outletId),
        paymentMethodId: Number(paymentMethodId),
        isActive: switchValue
      })
    })

    if(res.ok){
      router.refresh()
    } else {
      setAlert({
        boldContent: 'Error!',
        content: "Data belum tersimpan.",
        color: "failure"
      })
    }
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
      <AlertMsg />
      <ToggleSwitch checked={value} color="purple" onChange={setSwitch} />
    </div>
  )
}

export default TogglePayment