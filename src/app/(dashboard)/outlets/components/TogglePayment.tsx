'use client'

import { ToggleSwitch } from "flowbite-react"
import { useRouter } from "next/navigation"
import AlertMsg from "../../components/AlertMsg";
import { useAlertContext } from "@/app/context/alert/AlertContext";

const TogglePayment = ({
  value,
  outletId,
  paymentTypeId
}: {
  value: boolean,
  outletId: number
  paymentTypeId: number
}) => {

  const router = useRouter()
  const { setAlert } = useAlertContext()

  const setSwitch = async (switchValue : boolean) => {

    const res = await fetch(`/api/outlets/${outletId}/payment-methods/upsert`, {
      method: 'POST',
      body: JSON.stringify({
        outletId: Number(outletId),
        paymentTypeId: Number(paymentTypeId),
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
      <ToggleSwitch checked={value} onChange={setSwitch} />
    </div>
  )
}

export default TogglePayment