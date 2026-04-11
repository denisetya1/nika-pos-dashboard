"use client";

import { Pagination, Spinner } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const TablePagination = ({
  currentPage,
  totalPages,
  limit,
}: {
  currentPage: number;
  totalPages: number;
  limit: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selectedPage, setSelectedPage] = useState(currentPage);
  const [isPending, startTransition] = useTransition();

  const onPageChange = (page: number) => {
    setSelectedPage(page);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(selectedPage));
    params.set("limit", String(limit));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [selectedPage]);

  return (
    <div className="flex my-5 w-full justify-center sm:justify-end">
      {isPending && (
        <div className="fixed top-0 left-0 z-[99] w-full h-full flex items-center justify-center bg-black bg-opacity-40">
          <div className="text-white w-[60px] h-[60px]">
            <Spinner size={3} />
            {/* <Spinner /> asdasdsad */}
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default TablePagination;
