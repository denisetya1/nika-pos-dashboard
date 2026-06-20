"use client";

import { useRef, useState } from "react";
import { Product } from "@prisma/client";
import { Button, Modal, Tooltip } from "flowbite-react";
import BarcodePrintComponent from "./BarcodePrintComponent";
import { useReactToPrint } from "react-to-print";
import { LuPrinter } from "react-icons/lu";

const PrintBarcodeModal = ({
  product,
  disabled = false,
}: {
  product: Product;
  disabled: boolean;
}) => {
  const [isOpen, setOpen] = useState(false);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Tooltip content="Cetak Barcode" placement="bottom">
        <Button disabled={disabled} onClick={() => setOpen(true)} color="light">
          <LuPrinter />
        </Button>
      </Tooltip>
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <Modal.Header>Tambah Produk</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="w-full flex flex-col justify-center items-center bg-white p-6 rounded-md border-[1px] border-slate-200">
              <div className="border border-slate-400 p-5 py-0">
                <BarcodePrintComponent ref={componentRef} product={product} />
              </div>

              <div className="flex justify-end align-middle mt-10">
                <Button color="purple" onClick={handlePrint}>
                  Cetak Barcode
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpen(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PrintBarcodeModal;
