import { ProductStock } from "@prisma/client"

interface ErrorResponse {
  error: bool
  message: String
  errors: String[]
}

type history = {
  transactionId: string
  productId: number | bigint
  name: string
  qty: number
  price: Decimal | number | null
  date: Date
  direction: string
  description: string | null
}

type StockOpname = {
  stock: ProductStock,
  history: history[]
}