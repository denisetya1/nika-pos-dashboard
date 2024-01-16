'use client';

import {  MoveType, Outlet, Product, ProductStock } from "@prisma/client";
import { Button, Label, Modal, Select, TextInput, Textarea, Tooltip } from "flowbite-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  quantity: String
  moveTypeId: String
  description: String
  outletId: String
  productId: String
  productStockId: String
  direction: String
}

const StockMovementForm = ({
    outlet, 
    product, 
    direction, 
    currentQuantity, 
    movements,
    productStock,
    disabled
  }:
  {
    outlet: Outlet
    product: Product
    direction: string
    currentQuantity: number
    movements: MoveType[]
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

  movements = movements.filter((m) => m.direction === direction);

  const { register, handleSubmit, reset } = useForm<FormValues>(formOptions);

  const SubmitForm : SubmitHandler<FormValues> = async (formData) => {
    const body = formData

    const res = await fetch(`/api/products/${product.id}/${outlet.id}/stock`, {
      method: 'POST',
      body: JSON.stringify(body)
    })

    reset({...formOptions.defaultValues})
    router.refresh()
    setOpen(false)
  }

  useEffect(() => {
    if(productStock !== undefined){
      reset({...formOptions.defaultValues})
    }

  }, [productStock])

  return (
    <>
      <Tooltip content={direction === 'IN' ? 'Penambahan Stok' : 'Pengurangan Stok'} placement="bottom" style="light">
        <button className={`w-full h-full block py-2 px-4 ${disabled ? 'text-gray-300' : ' hover:bg-gray-200'}`} disabled={disabled} onClick={() => setOpen(true)}>{direction === 'IN' ? "+" : "-"}</button>
      </Tooltip>
      
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(SubmitForm)}>
          <Modal.Header>{direction === 'IN' ? 'PENAMBAHAN STOK (STOK MASUK)' : 'PENGURANGAN STOK (STOK KELUAR)'}</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
                <div className="grid gap-4 mb-4 grid-cols-2">

                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Outlet" />
                    </div>
                    <TextInput name="name" value={outlet.name} disabled/>
                  </div>
        
                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Nama Produk" />
                    </div>
                    <TextInput id="input-gray" name="name" value={product.name} disabled/>
                  </div>

                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Jumlah" />
                    </div>
                    <TextInput className="w-[100px]" min={1} type="number" {...register('quantity')} placeholder="" />
                  </div>

                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value={`Jenis ${direction ==='IN'? 'Penambahan' : 'Pengurangan'} Stok`} />
                    </div>
                    <Select {...register('moveTypeId')}>
                      {movements.map((movement) => <option key={movement.id} value={movement.id.toString()}>{movement.name}</option>)}
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Keterangan" />
                    </div>
                    <Textarea className="" {...register('description')} placeholder="" />
                  </div>
              
                </div>
                <input type="hidden" {...register("direction")}/>
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