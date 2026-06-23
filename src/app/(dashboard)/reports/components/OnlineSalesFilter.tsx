"use client";

import React, { useEffect, useState } from "react";
import { Brand, Category, Outlet } from "@prisma/client";
import { Datepicker, Label, Select, TextInput } from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import moment from "moment";

type IdName = {
  id: Number | string;
  name: string;
};

const StockListFilter = ({
  users,
  shifts,
  marketPlaces,
  couriers,
  outlets,
  selectedUser,
  selectedShift,
  selectedMarketPlace,
  selectedCourier,
  selectedOutlet,
  selectedDate,
}: {
  users: IdName[];
  shifts: IdName[];
  marketPlaces: string[];
  couriers: string[];
  outlets?: Outlet[];
  selectedUser: string | undefined;
  selectedShift: string | undefined;
  selectedOutlet?: string | undefined;
  selectedMarketPlace: string | undefined;
  selectedCourier: string | undefined;
  selectedDate?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setuserId] = useState(selectedUser);
  const [shiftId, setShiftId] = useState(selectedShift);
  const [marketPlace, setMarketPlace] = useState(selectedMarketPlace);
  const [courier, setCourier] = useState(selectedCourier);
  const [outletId, setOutletId] = useState(selectedOutlet);
  const [date, setDate] = useState(selectedDate);

  useEffect(() => {
    const query = {
      userId,
      shiftId,
      outletId,
      marketPlace,
      courier,
      date,
    };

    const qs = queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true,
    });

    router.push(`${pathname}?${qs}`);
    router.refresh();
  }, [userId, shiftId, outletId, marketPlace, courier, date, router]);

  return (
    <div className="flex flex-row justify-start gap-5 items-center mb-8">
      {outlets && outlets?.length > 0 ? (
        <div>
          <div className="mb-2 block">
            <Label htmlFor="product-name" value="Outlet" />
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

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="kasir" />
        </div>
        <Select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setuserId(e.target.value)
          }
          value={userId}
        >
          <option value="">Semua User</option>
          {users.map((user) => (
            <option key={user.id as string} value={user.id.toString()}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Shift" />
        </div>
        <Select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setShiftId(e.target.value)
          }
          value={shiftId}
        >
          <option value="">Semua Shift</option>
          {shifts.map((shift) => (
            <option key={shift.id as string} value={shift.id.toString()}>
              {shift.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Market Place" />
        </div>
        <Select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setMarketPlace(e.target.value)
          }
          value={marketPlace}
        >
          <option value="">Semua Market Place</option>
          {marketPlaces.map((mp: string) => (
            <option key={mp} value={mp}>
              {mp}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Kurir" />
        </div>
        <Select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setCourier(e.target.value)
          }
          value={courier}
        >
          <option value="">Semua Kurir</option>
          {couriers.map((cr: string) => (
            <option key={cr} value={cr}>
              {cr}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="product-name" value="Tanggal Laporan" />
        </div>
        <Datepicker
          language="en-ID"
          labelTodayButton="Hari Ini"
          labelClearButton="Batal"
          defaultDate={new Date(date || "")}
          weekStart={1}
          onSelectedDateChanged={(d) => setDate(moment(d).format("YYYY-MM-DD"))}
        />
      </div>
    </div>
  );
};

export default StockListFilter;
