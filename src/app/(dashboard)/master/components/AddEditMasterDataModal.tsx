'use client';

import { Brand, Category, MoveType, Outlet, StockMovement } from "@prisma/client";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  name: string
  direction?: string
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
    data?: Category | Brand | Outlet | MoveType
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
      name: formData.name,
      ...( withDirection ? {direction: formData.direction} : {} ),
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
                      <Label htmlFor="input-gray" color="gray" value={label} />
                    </div>
                    <TextInput id="input-gray" placeholder={placeholder} {...register("name")} />
                  </div>
                  {data && <input type="hidden" name="id" value={data.id.toString()} />}
                </div>

                {withDirection === true && <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value={labelDirection} />
                    </div>
                    <Select id="input-gray" placeholder={placeholder} {...register("direction")}>
                      <option value="IN">Masuk (Panambahan)</option>
                      <option value="OUT">Keluar (Pengurangan)</option>
                    </Select>
                  </div>
                  {data && <input type="hidden" name="id" value={data.id.toString()} />}
                </div>}
              
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