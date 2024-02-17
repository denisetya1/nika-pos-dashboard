'use client';

import { Brand, Category, MoveType, Outlet } from "@prisma/client";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ConfirmDeleteModal = ({
  data,
  endpoint, 
  buttonTitle,
  modalTitle,
  disabled
}:
  {
    data: {
      name: string
    }
    endpoint: string
    buttonTitle: string
    modalTitle: string
    disabled?: boolean
  }) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)

  const formOptions = {
    defaultValues: {...data}
  }

  const ConfirmDelete = async () => {
    const res = await fetch(endpoint, {
      method: 'DELETE'
    })
    
    router.refresh()
    setOpen(false)
  }

  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)} disabled={disabled}>{buttonTitle}</Button>
      
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <Modal.Header>{modalTitle}</Modal.Header>
        <Modal.Body className="p-6">
          <div className="space-y-6">
            <>Yakin akan menghapus <strong>{data.name}</strong>?</>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button type="submit" color="failure" onClick={() => {ConfirmDelete()}}>Ya</Button>
          <Button color="gray" onClick={() => setOpen(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ConfirmDeleteModal