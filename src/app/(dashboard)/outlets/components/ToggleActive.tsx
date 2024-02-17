'use client'

import { ToggleSwitch } from "flowbite-react"
import { useRouter } from "next/navigation"
import AlertMsg from "../../components/AlertMsg";
import { useAlertContext } from "@/app/context/alert/AlertContext";

const ToggleActive = ({
  value,
  method = 'PATCH',
  endpoint
}: {
  value: boolean
  method?: string
  endpoint: string
}) => {

  const router = useRouter()
  const { setAlert } = useAlertContext()

  const setSwitch = async (switchValue : boolean) => {

    const res = await fetch(endpoint, {
      method,
      body: JSON.stringify({
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

export default ToggleActive