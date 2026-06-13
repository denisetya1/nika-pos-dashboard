import { getExpiredProducts } from '@/actions/expiredProducts'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableHeader, Table, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import moment from 'moment';
import SoldOutButton from './components/SoldOutButton';

const page = async () => {
  const expiredProducts = await getExpiredProducts();

  return (
    <Card>
      <CardHeader>
        <CardTitle><h1 className='text-2xl mb-12'>Produk Mendekati Kadaluarsa &lt; 3 Bulan</h1></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="p-2 w-[40px]">No</TableHead>
                <TableHead className="p-2">Nama Produk</TableHead>
                <TableHead className="p-2 text-center">Tanggal Input</TableHead>
                <TableHead className="p-2 text-center">Jumlah Stok Input</TableHead>
                <TableHead className="p-2 text-center">Stok Akhir</TableHead>
                <TableHead className="p-2 text-center">Tanggal Kadaluarsa</TableHead>
                <TableHead className="p-2 text-center">Sisa Hari</TableHead>
                <TableHead className="p-2 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiredProducts && expiredProducts.map((expiredProd, index) => (
                <TableRow key={index} className="p-2">
                  <TableCell className="p-2">{index + 1}</TableCell>
                  <TableCell className="p-2">{expiredProd.productStock.product.name}</TableCell>
                  <TableCell className="p-2 text-center">{moment(expiredProd.moveDate).format("DD MMMM YYYY")}</TableCell>
                  <TableCell className="p-2 text-center">{expiredProd.quantity}</TableCell>
                  <TableCell className="p-2 text-center">{expiredProd.productStock.quantity}</TableCell>
                  <TableCell className="p-2 text-center">{moment(expiredProd.expiredDate).format("DD MMMM YYYY")}</TableCell>
                  <TableCell className="p-2 text-center">{moment(expiredProd.expiredDate).endOf('day').fromNow()}</TableCell>
                  <TableCell className="p-2">
                    <SoldOutButton
                      title='Sold Out'
                      id={expiredProd.id.toString()}
                      productName={expiredProd.productStock.product.name}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default page