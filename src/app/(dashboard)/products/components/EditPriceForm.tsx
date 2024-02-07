'use client';
import { Outlet, Product } from "@prisma/client";
import { Button, Label, Modal, TextInput, Tooltip } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FocusEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { PiPercentBold } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";

type FormValues = {
  sellPrice: Number
  productStockId: String,
  linkShopee: String | null,
  discountPercentage: Number | null,
  markupPercentage: Number | null,
}

const EditPriceForm = ({
    outlet, 
    product,
    sellPrice,
    discountPercentage,
    markupPercentage,
  }:
  {
    outlet: Outlet
    product: Product
    sellPrice?: Number,
    discountPercentage?: Number | null,
    markupPercentage?: Number | null,
  }) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)

  const formOptions = {
    defaultValues: {
      sellPrice: sellPrice ? `${sellPrice}` : '0',
      linkShopee: product.linkShopee,
      discountPercentage,
      markupPercentage
    }
  }

  const { register, handleSubmit, reset } = useForm<FormValues>(formOptions);

  const SubmitForm : SubmitHandler<FormValues> = async (formData) => {
    const body = formData

    const res = await fetch(`/api/products/${product.id}/${outlet.id}/price`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    })

    reset({...formOptions.defaultValues})
    router.refresh()
    setOpen(false)
  }

  useEffect(() => {
    reset({...formOptions.defaultValues})

  }, [sellPrice, discountPercentage, markupPercentage])

  const setSelected = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }

  return (
    <>
      <Tooltip content='Ubah Harga Jual' placement="bottom" style="light">
        <button className="text-blue-500" onClick={() => setOpen(true)}><LuPencilLine /></button>
      </Tooltip>
      
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(SubmitForm)}>
          <Modal.Header>Ubah Harga Barang</Modal.Header>
          <Modal.Body className="max-h-[400px] overflow-auto">
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
                      <Label htmlFor="input-gray" color="gray" value="Harga Jual" />
                    </div>
                    <TextInput className="w-[150px]" onFocus={setSelected} min={0} type="number" {...register('sellPrice')} placeholder="" />
                  </div>
                  
                  <div className="flex flex-row justify-between items-center">
                    <div className="col-span-2">
                      <div className="mb-2 block">
                        <Label htmlFor="input-gray" color="gray" value="Markup Harga" />
                      </div>
                      <TextInput className="w-[90px] text-right" onFocus={setSelected} rightIcon={PiPercentBold} min={0} max={99} type="number" {...register('markupPercentage')} placeholder="" />
                    </div>

                    <div className="col-span-2">
                      <div className="mb-2 block">
                        <Label htmlFor="input-gray" color="gray" value="Diskon" />
                      </div>
                      <TextInput className="w-[90px] text-right" onFocus={setSelected} rightIcon={PiPercentBold} min={0} max={99} type="number" {...register('discountPercentage')} placeholder="" />
                    </div>
                  </div>

                  {/* <div className="col-span-2">
                    <div className="mb-2 block">
                      <Label htmlFor="input-gray" color="gray" value="Link Shopee" />
                    </div>
                    <TextInput min={0} type="text" {...register('linkShopee')} placeholder="" />
                  </div> */}
              
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

export default EditPriceForm