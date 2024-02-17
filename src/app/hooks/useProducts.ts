import queryString from "query-string"
import { useQuery } from "@tanstack/react-query"

type ProductFilter = {
  search?: string
  outletId: string
  brandId?: string
  categoryId?: string
  limit: Number
  page: Number
}

const fetchProduct = (filter: ProductFilter) => {
  
  const { outletId } = filter

  const buildQuery = queryString.stringify({
    ...filter,
    outletId: undefined
  }, {
    skipNull: true,
    skipEmptyString: true
  })

  return fetch(`/api/pos/${outletId}/products?${buildQuery}`)
}

const useProducts = ( productFilter: ProductFilter ) => {
  return []
  // return useQuery('products', () => fetchProduct(productFilter), {
  //   select: (data) => data
  // })
}

export default useProducts