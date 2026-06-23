"use client";
import { formatCurrency } from "@/lib/functions";
import { Prisma } from "@prisma/client";
import { Button, Modal, Table } from "flowbite-react";
import moment from "moment";
import { useState } from "react";

type Transaction = Prisma.TransactionGetPayload<{
  include: {
    user: true;
    outlet: true;
    userShift: {
      include: {
        shift: true;
      };
    };
    outletPaymentMethod: {
      include: {
        paymentMethod: true;
      };
    };
    transactionDetails: true;
    transactionDiscount: true;
  };
}>;

const AddEditMasterDataModal = ({
  transaction,
  buttonTitle,
  modalTitle,
}: {
  transaction: Transaction;
  buttonTitle: React.ReactNode;
  modalTitle: string;
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="light" onClick={() => setOpen(true)}>
        {buttonTitle}
      </Button>

      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <Modal.Header>{modalTitle}</Modal.Header>
        <Modal.Body className="py-10 overflow-auto max-h-[70%]">
          <div className="w-full">
            <div className="mb-10">
              <div>
                No. Transaksi: <strong>{transaction.id}</strong>
              </div>
              <div>
                Waktu:{" "}
                <strong>
                  {moment(transaction.transactionTime).format(
                    "DD-MM-YYYY HH:mm:ss",
                  )}
                </strong>
              </div>
              <div>
                Kasir: <strong>{transaction.user.name}</strong>
              </div>
            </div>
            <Table
              striped={true}
              className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-[1px] border-slate-200">
                <Table.HeadCell>No.</Table.HeadCell>
                <Table.HeadCell>Nama Produk</Table.HeadCell>
                <Table.HeadCell>Jumlah</Table.HeadCell>
                <Table.HeadCell>Harga</Table.HeadCell>
                <Table.HeadCell>Total</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {transaction.transactionDetails &&
                  transaction.transactionDetails.map((td, index) => (
                    <Table.Row key={index}>
                      <Table.Cell className="p-2 text-center align-top">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell className="p-2">
                        <div>{td.name}</div>
                        <div>{td.barcode}</div>
                      </Table.Cell>
                      <Table.Cell className="p-2 text-center">
                        {td.qty}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        {formatCurrency(Number(td.finalSellPrice))}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        {formatCurrency(Number(td.total))}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                <Table.Row className="bg-gray-100 p-0">
                  <Table.Cell
                    colSpan={4}
                    className="p-2 text-right bg-gray-100"
                  >
                    Sub Total:
                  </Table.Cell>
                  <Table.Cell className="text-right bg-gray-100">
                    <strong>
                      {formatCurrency(Number(transaction.subTotal))}
                    </strong>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-gray-100 p-0">
                  <Table.Cell
                    colSpan={4}
                    className="p-2 text-right bg-gray-100"
                  >
                    Diskon{" "}
                    {transaction.transactionDiscount &&
                      transaction.transactionDiscount.discountType ===
                        "PERCENT" &&
                      `(${transaction.transactionDiscount.discountValue}%)`}{" "}
                    :
                  </Table.Cell>
                  <Table.Cell className="text-right bg-gray-100">
                    <strong>
                      {Number(transaction.totalDiscount) > 0 ? "-" : ""}
                      {formatCurrency(Number(transaction.totalDiscount))}
                    </strong>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-gray-100 p-0">
                  <Table.Cell
                    colSpan={4}
                    className="p-2 text-right bg-gray-100"
                  >
                    Total:
                  </Table.Cell>
                  <Table.Cell className="text-right bg-gray-100">
                    <strong>
                      {formatCurrency(Number(transaction.totalPrice))}
                    </strong>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-gray-100 p-0">
                  <Table.Cell
                    colSpan={4}
                    className="p-2 text-right bg-gray-100"
                  >
                    Total Bayar:
                  </Table.Cell>
                  <Table.Cell className="text-right bg-gray-100">
                    <strong>
                      {formatCurrency(Number(transaction.amountPaid))}
                    </strong>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-gray-100 p-0">
                  <Table.Cell
                    colSpan={4}
                    className="p-2 text-right bg-gray-100"
                  >
                    Total Kembali:
                  </Table.Cell>
                  <Table.Cell className="text-right bg-gray-100">
                    <strong>
                      {formatCurrency(Number(transaction.amountChange))}
                    </strong>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-gray-100 p-0">
                  <Table.Cell
                    colSpan={4}
                    className="p-2 text-right bg-gray-100"
                  >
                    Metode Pembayaran:
                  </Table.Cell>
                  <Table.Cell className="text-right bg-gray-100">
                    <strong>
                      {transaction.outletPaymentMethod.paymentMethod.name}
                    </strong>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="gray" onClick={() => setOpen(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditMasterDataModal;
