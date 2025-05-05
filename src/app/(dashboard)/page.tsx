import { getRealtimeSummary, getTopCategory, getTopMonthlyProducts } from "@/actions/Summaries"

const HomePage = async () => {
  const getTopProduct = await getTopMonthlyProducts()
  const summary = await getRealtimeSummary()
  const cat = await getTopCategory();

  return (
    <div className="flex w-full">
      <div className="flex p-5 bg-white rounded-lg shadow-md flex-col gap-5 w-full">
        <div className="mb-10"><h1 className="font-semibold text-xl">Produk Terlaris</h1></div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 w-[40px]">No</th>
              <th className="p-2">Nama Produk</th>
              <th className="p-2">Jumlah Terjual</th>
            </tr>
          </thead>
          <tbody>
            {getTopProduct.map((product, index) => <tr key={index} className="p-2">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.qty}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HomePage