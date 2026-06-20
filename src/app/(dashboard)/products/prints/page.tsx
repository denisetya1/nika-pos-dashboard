"use client";

import { Brand, Category, Outlet, Prisma } from "@prisma/client";
import { Button, Label, Select } from "flowbite-react";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import ComponentToPrint from "./components/ComponentToPrint";
import { useReactToPrint } from "react-to-print";
import { useQuery } from "@tanstack/react-query";

type ProductStock = Prisma.ProductStockGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        categories: true;
      };
    };
  };
}>;

const PrintPricePage = () => {
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [productPrices, setProductPrices] = useState<ProductStock[]>([]);
  const componentRef = useRef(null);

  const { data: outlets } = useQuery({
    queryKey: ["outlets"],
    queryFn: () =>
      fetch(`/api/outlets`, {
        cache: "no-cache",
      }).then((res) => res.json()),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () =>
      fetch(`/api/brands`, {
        cache: "no-cache",
      }).then((res) => res.json()),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetch(`/api/categories`, {
        cache: "no-cache",
      }).then((res) => res.json()),
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (outlets && outletId === null) {
      setOutletId(outlets[0].id);
    }
  }, [outlets, outletId]);

  useEffect(() => {
    if (brands && brandId === null) {
      setOutletId(brands[0].id);
    }
  }, [brands, outletId]);

  useEffect(() => {
    if (categories && categoryId === null) {
      setOutletId(categories[0].id);
    }
  }, [categories, outletId]);

  useEffect(() => {
    if (outletId !== null) findProductPrice(outletId);
  }, [outletId, brandId, categoryId]);

  const query = queryString.stringify(
    {
      outletId,
      brandId,
      categoryId,
      searchProduct,
      havePriceOnly: 1,
    },
    {
      skipEmptyString: true,
      skipNull: true,
    },
  );

  const findProductPrice = (outletId: Number | string) => {
    fetch(
      `/api/products/prices/${outletId}${query !== "" ? `?${query}` : ""}`,
      {
        cache: "no-cache",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setProductPrices(data);
      });
  };

  return (
    <div className="grow">
      <div>
        <h1 className="font-bold text-2xl mb-10">CETAK HARGA PRODUK</h1>
      </div>

      <div>
        <div className="sm:flex flex-row justify-start gap-5 items-center mb-8">
          {outlets && outlets?.length > 0 && (
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
                {outlets.map((outlet: Outlet) => (
                  <option key={outlet.id} value={outlet.id.toString()}>
                    {outlet.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {categories && categories?.length > 0 && (
            <div>
              <div className="mb-2 block">
                <Label htmlFor="product-name" value="Ketegori" />
              </div>
              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCategoryId(e.target.value)
                }
                value={categoryId}
              >
                <option value="">Semua Kategori</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {brands && brands?.length > 0 && (
            <div>
              <div className="mb-2 block">
                <Label htmlFor="product-name" value="Brand" />
              </div>
              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setBrandId(e.target.value)
                }
                value={brandId}
              >
                <option value="">Semua Brand</option>
                {brands.map((brand: Brand) => (
                  <option key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-md border-[1px] border-slate-200">
        <div className="flex justify-end align-middle mb-5">
          <Button color="purple" onClick={handlePrint}>
            Cetak Label
          </Button>
        </div>
        <ComponentToPrint ref={componentRef} productPrices={productPrices} />
      </div>
    </div>
  );
};

export default PrintPricePage;
