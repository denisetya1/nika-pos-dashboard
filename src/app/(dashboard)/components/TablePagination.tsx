'use client'

import { Pagination } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TablePagination = ({currentPage, totalPages, limit} : 
  {
    currentPage: number,
    totalPages: number,
    limit: number
  }) => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const [selectedPage, setSelectedPage] = useState(currentPage)

  const onPageChange = (page: number) => {
    setSelectedPage(page)
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(selectedPage))
    params.set("limit", String(limit))

    router.push(`${pathname}?${params.toString()}`)
  }, [selectedPage])

  return (
    <div className="flex my-5 w-full justify-end">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default TablePagination