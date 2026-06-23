"use client";

import React, { useState } from "react";
import { Outlet } from "@prisma/client";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { RxCross2 } from "react-icons/rx";
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import moment from "moment";
import { Datepicker } from "flowbite-react";

const OutletDateRangeFilter = ({
  outlets,
  selectedOutlet,
  selectedStartDate,
  selectedEndDate,
  searched,
}: {
  outlets?: Outlet[];
  selectedOutlet?: string | undefined;
  selectedStartDate?: string;
  selectedEndDate?: string;
  searched?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [outletId, setOutletId] = useState(selectedOutlet);
  const [search, setSearch] = useState(searched);
  const [startDate, setStartDate] = useState(
    new Date(moment().subtract(30, "days").format("YYYY-MM-DD")),
  );
  const [endDate, setEndDate] = useState(new Date());

  const submitFilter = () => {
    if (startDate !== null && endDate !== null) {
      const query = {
        outletId,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
        search,
      };

      const qs = queryString.stringify(query, {
        skipEmptyString: true,
        skipNull: true,
      });

      router.push(`${pathname}?${qs}`);
      router.refresh();
    } else {
      alert("Pilih Tanggal Mulai dan Tanggal Berakhir!");
    }
  };

  return (
    <div className="flex flex-row justify-start gap-5 items-center mb-8">
      {outlets && outlets?.length > 0 ? (
        <div>
          <div className="mb-2 block">
            <Label
              className="text-slate-600"
              htmlFor="product-name"
              value="Outlet"
            />
          </div>
          <Select
            color="info"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setOutletId(e.target.value)
            }
            value={outletId}
          >
            {outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id.toString()}>
                {outlet.name}
              </option>
            ))}
          </Select>
        </div>
      ) : (
        <></>
      )}

      <div className="w-[350px]">
        <div className="mb-2 block">
          <Label
            className="text-slate-600"
            htmlFor="product-name"
            value="Cari Produk"
          />
        </div>
        <div className="relative">
          <TextInput
            id="product-name"
            className="w-full pr-[20px]"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            type="text"
            placeholder="Cari berdasarkan nama produk/barcode"
          />
          {search && search !== "" && (
            <Button
              onClick={() => setSearch("")}
              className="absolute right-[30px] w-[16px] h-[16px] 
            rounded-full text-center text-white top-[50%] mt-[-8px]"
            >
              <RxCross2 size={10} />
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 block">
          <Label
            className="text-slate-600"
            htmlFor="product-name"
            value="Pilih Tanggal"
          />
        </div>

        <div className="flex flex-row gap-4 justify-start items-center">
          <Datepicker
            language="en-ID"
            labelTodayButton="Hari Ini"
            labelClearButton="Batal"
            defaultDate={startDate}
            weekStart={1}
            onSelectedDateChanged={(d) => setStartDate(d)}
          />{" "}
          <div>-</div>
          <Datepicker
            language="en-ID"
            labelTodayButton="Hari Ini"
            labelClearButton="Batal"
            defaultDate={endDate}
            minDate={startDate}
            weekStart={1}
            onSelectedDateChanged={(d) => setEndDate(d)}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 block">&nbsp;</div>
        <Button onClick={submitFilter}>Tampilkan</Button>
      </div>
    </div>
  );
};

export default OutletDateRangeFilter;
