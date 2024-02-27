'use client';

import { Brand, Category, MoveType, Outlet, StockMovement } from "@prisma/client";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  name: string
  phone: string | null
  address: string | null
  printHeaderLine1: string | null
  printHeaderLine2: string | null
  printHeaderLine3: string | null
  printHeaderLine4: string | null
  printHeaderLine5: string | null
  printExtraInfo: string | null
}

const AddEditMasterDataModal = ({
  data,
  endpoint, 
  label,
  placeholder,
  buttonTitle,
  modalTitle,
  disabled,
  withDirection,
  labelDirection
}:
  {
    data?: Outlet
    endpoint: string
    label?: string
    placeholder?: string
    buttonTitle: string
    modalTitle: string
    disabled?: boolean
    withDirection?: boolean
    labelDirection?: string
  }) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)

  const formOptions = {
    defaultValues: {...data}
  }

  const { register, handleSubmit, reset } = useForm<FormValues>(formOptions);

  const SubmitForm : SubmitHandler<FormValues> = async (formData) => {
    const body = {
      ...formData
    }

    console.log(body);

    const res = await fetch(endpoint, {
      method: data ? 'PUT' : 'POST',
      body: JSON.stringify(body)
    })

    reset()
    router.refresh()
    setOpen(false)
  }

  useEffect(() => {
    if(data){
      reset({
        name: data.name,
        phone: data.phone,
        address: data.address,
        printHeaderLine1: data.printHeaderLine1,
        printHeaderLine2: data.printHeaderLine2,
        printHeaderLine3: data.printHeaderLine3,
        printHeaderLine4: data.printHeaderLine4,
        printHeaderLine5: data.printHeaderLine5,
        printExtraInfo: data.printExtraInfo,
      })
    }
  }, [data])

  return (
    <>
      <Button color="blue" onClick={() => setOpen(true)} disabled={disabled}>{buttonTitle}</Button>
      
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(SubmitForm)}>
          <Modal.Header>{modalTitle}</Modal.Header>
          <Modal.Body className="py-10 max-h-[400px] overflow-auto">
            <div className="space-y-6">

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value={label} />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("name")} />
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="No. Telp." />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("phone")} />
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Alamat" />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("address")} />
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Print Header Baris 1" />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("printHeaderLine1")} />
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Print Header Baris 2" />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("printHeaderLine2")} />
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Print Header Baris 3" />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("printHeaderLine3")} />
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Print Header Baris 4" />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("printHeaderLine4")} />
                  </div>
                </div>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Print Header Baris 5" />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("printHeaderLine5")} />
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Print Extra Info" />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("printExtraInfo")} />
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