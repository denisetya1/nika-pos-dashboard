'use client';

import { Brand, Category, Product } from "@prisma/client";
import { Button, FileInput, Label, Modal, Select, TextInput, Tooltip } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import AlertMsg from "../../components/AlertMsg";
import { useAlertContext } from "@/app/context/alert/AlertContext";

type FormValues = {
  name?: string
  priceTagLabel?: string | null
  description?: string | null
  categoryId?: Number
  brandId?: Number
  sku?: string | null,
  barcode?: string | null,
}

const AddEditProductModal = ({categories, brands, product, btnTitle, btnColor, endpoint, tooltipText}:
  {
    categories: Category[]
    brands: Brand[]
    product?: Product
    btnTitle: React.ReactNode
    btnColor: string
    endpoint: string
    tooltipText?: string
  }) => {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)
  const { setAlert } = useAlertContext()
  const isEdit = product !== undefined

  const formOptions = {
    defaultValues: {
      ...product
    }
  }

  const { register, handleSubmit, reset } = useForm<FormValues>(formOptions);

  
  const SubmitForm : SubmitHandler<FormValues> = async (formData) => {
    const body = {
      name: formData.name,
      description: formData.description,
      priceTagLabel: formData.priceTagLabel,
      categoryId: Number(formData.categoryId),
      brandId: Number(formData.brandId),
      sku: formData.sku,
      barcode: formData.barcode,
    }

    const res = await fetch(endpoint, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(body)
    })

    if(res.ok){
      reset()
      router.refresh()
      setOpen(false)
    } else {
      setAlert({
        boldContent: 'Error!',
        content: "Data belum tersimpan.",
        color: "failure"
      })
    }
  }

  useEffect(() => {
    reset({...product})
  }, [product])

  return (
    <>
      <Tooltip content={tooltipText} placement="bottom">
        <Button onClick={() => setOpen(true)} color={btnColor}>{btnTitle}</Button>
      </Tooltip>
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(SubmitForm)}>
          <Modal.Header>Tambah Produk</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">

              <AlertMsg />

              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <div className="mb-2 block">
                    <Label htmlFor="input-gray" color="gray" value="Nama Produk" />
                  </div>
                  <TextInput id="input-gray" {...register("name")} placeholder="Nama Produk" />
                </div>

                <div className="col-span-2">
                  <div className="mb-2 block">
                    <Label htmlFor="input-gray" color="gray" value="Nama di Label Harga" />
                  </div>
                  <TextInput id="input-gray" {...register("priceTagLabel")} maxLength={38} placeholder="max. 38 karakter" />
                </div>

                <div className="col-span-1">
                  <div className="mb-2 block">
                    <Label htmlFor="input-gray" color="gray" value="Kategori" />
                  </div>
                  <Select id="input-gray" {...register("categoryId")}>
                    {categories.map((category) => (
                      <option key={category.id.toString()} value={category.id.toString()}>{category.name}</option>
                    ))}
                  </Select>
                </div>

                <div className="col-span-1">
                  <div className="mb-2 block">
                    <Label htmlFor="input-gray" color="gray" value="Brand" />
                  </div>
                  <Select id="input-gray" {...register("brandId")} >
                    {brands.map((brand) => (
                      <option key={brand.id.toString()} value={brand.id.toString()}>{brand.name}</option>
                    ))}
                  </Select>
                </div>
                
                <div className="col-span-1">
                  <div className="mb-2 block">
                    <Label htmlFor="input-info" value="SKU" />
                  </div>
                  <TextInput id="input-info" placeholder="SKU" {...register("sku")}/>
                </div>

                <div className="col-span-1">
                  <div className="mb-2 block">
                    <Label htmlFor="input-info" value="Barcode" />
                  </div>
                  <TextInput id="input-info" placeholder="Barcode" {...register("barcode")}/>
                </div>
            
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Simpan Produk</Button>
            <Button color="gray" onClick={() => setOpen(false)}>
              Batalkan
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddEditProductModal