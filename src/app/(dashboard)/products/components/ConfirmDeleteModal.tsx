'use client';

import { Button, Modal, Tooltip } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ConfirmDeleteModal = ({
  deletedName,
  endpoint, 
  buttonTitle,
  modalTitle,
  disabled,
  tooltipText,
  btnColor = "failure"
}:
  {
    deletedName: string
    endpoint: string
    buttonTitle: React.ReactNode
    modalTitle: string
    disabled?: boolean
    tooltipText?: string
    btnColor?: string
  }) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)

  const ConfirmDelete = async () => {
    const res = await fetch(endpoint, {
      method: 'DELETE'
    })
    
    router.refresh()
    setOpen(false)
  }

  return (
    <>
      <Tooltip placement="bottom" content={tooltipText}>
        <Button color={btnColor} onClick={() => setOpen(true)} disabled={disabled}>{buttonTitle}</Button>
      </Tooltip>
      
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <Modal.Header>{modalTitle}</Modal.Header>
        <Modal.Body className="p-6">
          <div className="space-y-6">
            <>Yakin akan menghapus <strong>{deletedName}</strong>?</>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="failure" onClick={() => {ConfirmDelete()}}>Ya</Button>
          <Button color="gray" onClick={() => setOpen(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ConfirmDeleteModal