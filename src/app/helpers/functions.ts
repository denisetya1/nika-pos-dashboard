export const formatCurrency = (
  num: number | undefined | null
) => {
  if(num === undefined || num === null){
    num = 0
  }

  let idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  return idr.format(num)
}

export const isEmptyVal= (value: any, includeZero?: boolean) => {
  if(value === '' || value === undefined || value === null || (includeZero === true && value === 0)){
    return true
  }

  return false
}

export const sortByKey = (arr: Array<any>, key: string, sort: string) => {
  if(sort === 'asc'){
    arr.sort(function(a, b){return a[key] - b[key]});
  } else {
    arr.sort(function(a, b){return b[key] - a[key]});
  }

  return arr
}