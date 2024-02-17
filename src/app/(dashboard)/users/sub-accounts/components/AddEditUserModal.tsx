'use client';

import { User } from "@prisma/client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  name: String
  username: String 
  password: String
  phone: String
}

const AddEditUserDataModal = ({
  data,
  buttonTitle,
  modalTitle,
  disabled,
  storeSlugName
}:
  {
    data?: User
    buttonTitle: string
    modalTitle: string
    disabled?: boolean
    storeSlugName?: string
  }) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)
  const [editPassword, setEditPassword] = useState(false)
  const [ __, username ] = (data?.username||'').split(':')

  const formOptions = {
    ...(data ? {defaultValues: {
      name: data.name,
      username: username as string,
      phone: data.phone as string,
      password: ''
    }} : {}),
  }

  const { register, handleSubmit, reset, resetField } = useForm<FormValues>(formOptions);

  const SubmitForm : SubmitHandler<FormValues> = async (formData) => {
    const body = {
      ...formData,
      username: `${storeSlugName?.trim()}:${formData.username.trim()}`,
      storeId:1,
      isActive: true,
    }

    const res = await fetch(`/api/users${data? `/${data.id}` : ''}`, {
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
        username: username as string,
        phone: data.phone as string,
        password: ''
      })
    }
  }, [data])

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
                      <Label htmlFor="input-gray" color="gray" value={"Nama"} />
                    </div>
                    <TextInput id="input-gray" {...register("name")} />
                  </div>
                </div>
                
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value={"No. HP"} />
                    </div>
                    <TextInput id="input-gray" {...register("phone")} />
                  </div>
                </div>

                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value={"Username"} />
                    </div>
                    <div className="flex justify-start items-center gap-0">
                      <div className="p-2 pr-2 text-gray-500 bg-gray-100 border-solid border-[1px] border-gray-200 rounded-l-lg">
                        {`${storeSlugName}: `}
                      </div>
                      <input 
                        className="p-2 pr-0 bg-gray-50 w-full border-solid border-[1px] border-gray-200 rounded-r-lg"
                        {...register("username")}
                      />
                    </div>
                  </div>
                </div>

                {data && !editPassword && <div>
                  <button onClick={() => {
                    setEditPassword((editP)=>!editP)
                  }}
                  className="text-sm text-blue-600"
                  >+Ubah Password</button>
                </div>}
                {((data && editPassword) || !data)  && <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="mb-2 flex justify-start items-center gap-2">
                      <Label htmlFor="input-gray" color="gray" value={"Password"} />
                      {data && editPassword && <div>
                        <button onClick={() => {
                            setEditPassword((editP)=>!editP)
                            resetField('password')
                          }}
                          className="text-sm text-blue-600"
                        >[Batal]</button>
                      </div>}
                    </div>
                    <TextInput id="input-gray" {...register("password")} />
                  </div>
                </div>
                }
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

export default AddEditUserDataModal