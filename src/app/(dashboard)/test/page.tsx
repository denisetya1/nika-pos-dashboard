import { getTopMonthlyProducts } from "@/actions/Summaries"

const page = async () => {
  const a = await getTopMonthlyProducts()

  return (
    <div>page</div>
  )
}

export default page