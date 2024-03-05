'use client'

import { ToggleSwitch } from "flowbite-react"
import { useRouter } from "next/navigation"
import AlertMsg from "../../components/AlertMsg";
import { useAlertContext } from "@/context/alert/AlertContext";

const POSToggle = ({
  value,
  outletId
}: {
  value?: boolean,
  outletId: number
}) => {

  const router = useRouter()
  const { setAlert } = useAlertContext()

  const setSwitch = async (switchValue : boolean) => {

    const res = await fetch(`/api/outlets/${outletId}/pos`, {
      method: 'PATCH',
      body: JSON.stringify({
        isActivePOS: switchValue
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
      <ToggleSwitch checked={value ? value : false} color="purple" onChange={setSwitch} />
    </div>
  )
}

export default POSToggle