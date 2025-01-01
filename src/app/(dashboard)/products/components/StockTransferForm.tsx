'use client';

import { Outlet, Prisma, ProductStock } from "@prisma/client";
import { Button, Label, Modal, Select, TextInput, Textarea, Tooltip } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { BiTransfer } from "react-icons/bi";

type Product = Prisma.ProductGetPayload<{
  include: { brand: true, category: true, stocks: true }
}>

type FormValues = {
  quantity: String
  moveTypeId: String
  description: String
  outletId: String
  productId: String
  productStockId: String
  outletDestinationId: String
  withPrice: String
}

const StockMovementForm = ({
  outlet,
  product,
  direction,
  productStock,
  disabled,
  currentQuantity,
  outlets
}:
  {
    outlet: Outlet
    product: Product
    direction: string
    currentQuantity: number
    outlets: Outlet[]
    productStock?: ProductStock
    disabled?: boolean
  }) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)

  const formOptions = {
    defaultValues: {
      outletId: outlet.id.toString(),
      productId: product.id.toString(),
      productStockId: productStock ? productStock.id.toString() : '',
      direction
    }
  }

  const { register, handleSubmit, reset, control } = useForm<FormValues>(formOptions);

  const SubmitForm: SubmitHandler<FormValues> = async (formData) => {
    const body = formData

    const res = await fetch(`/api/products/${product.id}/${outlet.id}/transfer`, {
      method: 'POST',
      body: JSON.stringify({
        ...body,
      })
    })

    reset({ ...formOptions.defaultValues })
    router.refresh()
    setOpen(false)
  }

  useEffect(() => {
    if (productStock !== undefined) {
      reset({ ...formOptions.defaultValues })
    }

  }, [productStock])

  outlets = outlets.filter((o) => o.id != outlet.id)

  return (
    <>
      <Tooltip content={'Transfer Stok'} placement="bottom" style="light">
        <Button color="light" disabled={disabled} onClick={() => setOpen(true)}>
          <BiTransfer />
        </Button>
      </Tooltip>

      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(SubmitForm)}>
          <Modal.Header>TRANSFER STOK</Modal.Header>
          <Modal.Body className="dark:text-gray-300 max-h-[400px] overflow-auto">
            <div className="space-y-6">
              <div className="grid gap-4 mb-4 grid-cols-2">

                <div className="col-span-2">
                  <div className="mb-2 block">
                    <Label htmlFor="input-gray" color="gray" value="Outlet" />
                  </div>
                  <TextInput name="name" value={outlet.name} disabled />
                </div>

                <div className="col-span-2">
                  <div className="mb-2 block">
                    <Label htmlFor="input-gray" color="gray" value="Nama Produk" />
                  </div>
                  <TextInput id="input-gray" name="name" value={product.name} disabled />
                </div>

                <div className="col-span-2 flex gap-10 w-full">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Jumlah" />
                    </div>
                    <TextInput className="w-[100px]" min={1} max={currentQuantity} type="number" {...register('quantity')} placeholder=""
                      helperText={
                        <>
                          stok tersedia: {currentQuantity}
                        </>
                      }
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Samakan Harga?" />
                    </div>
                    <Select {...register('withPrice')} helperText={
                      <>
                        Jika memilih Ya, harga pada outlet tujuan akan disamakan.
                      </>
                    }>
                      <option value="0">Tidak</option>
                      <option value="1">Ya</option>
                    </Select>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="mb-2 block">
                    <Label htmlFor="input-gray" color="gray" value="Tujuan Outlet" />
                  </div>
                  <Select {...register('outletDestinationId')}>
                    <option>Pilih Outlet</option>
                    {outlets && outlets.map((o) => <option key={o.id} value={o.id.toString()}>{o.name}</option>)}
                  </Select>
                </div>

                <div className="col-span-2">
                  <div className="mb-2 block">
                    <Label htmlFor="input-gray" color="gray" value="Keterangan" />
                  </div>
                  <Textarea className="" {...register('description')} placeholder="" />
                </div>

              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Simpan</Button>
            <Button color="gray" onClick={() => setOpen(false)}>
              Batalkan
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default StockMovementForm