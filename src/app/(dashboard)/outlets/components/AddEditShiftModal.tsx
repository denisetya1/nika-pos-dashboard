'use client';

import { Shift } from "@prisma/client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  name: string
  workingHours: string
}

const AddEditMasterDataModal = ({
  data,
  endpoint, 
  placeholder,
  buttonTitle,
  modalTitle,
  disabled,
  outletName
}:
  {
    data?: Shift
    endpoint: string
    placeholder?: string
    buttonTitle: string
    modalTitle: string
    disabled?: boolean
    outletName: string
  }) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)

  const formOptions = {
    ...( data ? {defaultValues: {
      name: String(data?.name),
      workingHours: data?.workingHours ? data?.workingHours : ''
    }} : {})
  }

  const { register, handleSubmit, reset } = useForm<FormValues>(formOptions);

  const SubmitForm : SubmitHandler<FormValues> = async (formData) => {
    const body = {
      name: formData.name,
      workingHours: formData.workingHours
    }

    const res = await fetch(endpoint, {
      method: data ? 'PUT' : 'POST',
      body: JSON.stringify(body)
    })

    reset()
    router.refresh()
    setOpen(false)
  }

  return (
    <>
      <Button color="blue" onClick={() => setOpen(true)} disabled={disabled}>{buttonTitle}</Button>
      
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(SubmitForm)}>
          <Modal.Header>{modalTitle}</Modal.Header>
          <Modal.Body className="py-10">
            <div className="space-y-6">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value={"Outlet"} />
                    </div>
                    <TextInput id="input-gray" disabled={true} value={outletName} />
                  </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value={"Nama Shift"} />
                    </div>
                    <TextInput id="input-gray" placeholder={"Nama Shift"} {...register("name")} />
                  </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value={"Jam Kerja"} />
                    </div>
                    <TextInput id="input-gray" placeholder={"contoh: 08:00-16:00"} {...register("workingHours")} />
                  </div>
                </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
            <Button type="submit">Simpan</Button>
            <Button color="gray" onClick={() => setOpen(false)}>
              Batal
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddEditMasterDataModal